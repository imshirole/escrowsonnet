const { createHash, randomBytes } = require("node:crypto");

const COLLATERAL_BPS = 3000;
const ALLOWED_CURRENCIES = new Set(["USD", "EUR", "GBP", "CAD", "AUD"]);
const TERMINAL_STATES = new Set(["COMPLETED", "CANCELLED", "EXPIRED"]);
const ALLOWED_TRANSITIONS = {
  CREATED: new Set(["SELLER_COLLATERAL_PENDING", "CANCELLED", "EXPIRED"]),
  SELLER_COLLATERAL_PENDING: new Set(["SELLER_FUNDED", "CANCELLED", "EXPIRED"]),
  SELLER_FUNDED: new Set(["BUYER_PAYMENT_PENDING", "CANCELLED", "EXPIRED"]),
  BUYER_PAYMENT_PENDING: new Set(["BUYER_FUNDED", "CANCELLED", "EXPIRED"]),
  BUYER_FUNDED: new Set(["ACTIVE", "DISPUTED", "CANCELLED"]),
  ACTIVE: new Set(["DELIVERED", "DISPUTED", "CANCELLED", "EXPIRED"]),
  DELIVERED: new Set(["COMPLETED", "DISPUTED", "CANCELLED", "EXPIRED"]),
  DISPUTED: new Set(["ACTIVE", "COMPLETED", "CANCELLED"]),
  COMPLETED: new Set(),
  CANCELLED: new Set(),
  EXPIRED: new Set()
};

class TransactionError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "TransactionError";
    this.statusCode = statusCode;
  }
}

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function parseAmountToMinorUnits(value) {
  const input = String(value ?? "").trim();
  const match = /^(\d{1,12})(?:\.(\d{1,2}))?$/.exec(input);
  if (!match) throw new TransactionError("Invoice amount must be a positive value with at most two decimal places");
  const whole = BigInt(match[1]);
  const fractional = BigInt((match[2] || "").padEnd(2, "0"));
  const amount = whole * 100n + fractional;
  if (amount < 2n || amount > 1_000_000_000_000n) {
    throw new TransactionError("Invoice amount is outside the supported range");
  }
  return Number(amount);
}

function formatMinorUnits(value) {
  const minor = BigInt(value);
  const whole = minor / 100n;
  const fractional = (minor % 100n).toString().padStart(2, "0");
  return `${whole}.${fractional}`;
}

function calculateCollateralMinor(invoiceAmountMinor) {
  return Number((BigInt(invoiceAmountMinor) * BigInt(COLLATERAL_BPS) + 5000n) / 10000n);
}

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function cleanString(value, fieldName, maxLength, { optional = false } = {}) {
  const result = typeof value === "string" ? value.trim() : "";
  if (!result && !optional) throw new TransactionError(`${fieldName} is required`);
  if (result.length > maxLength) throw new TransactionError(`${fieldName} is too long`);
  return result;
}

function rowToTransaction(row, { includeVendorDetails = true, includePaymentLink = false } = {}) {
  if (!row) return null;
  const invoiceAmount = formatMinorUnits(row.invoice_amount_minor);
  const buyerCollateral = formatMinorUnits(row.buyer_collateral_minor);
  const sellerCollateral = formatMinorUnits(row.seller_collateral_minor);
  const transaction = {
    escrowId: row.escrow_id,
    ...(includeVendorDetails ? {
      vendor: { name: row.vendor_name },
      buyer: { name: row.buyer_name, contact: row.buyer_contact }
    } : {
      vendor: { name: row.vendor_name },
      buyer: { name: row.buyer_name }
    }),
    invoiceAmount,
    currency: row.currency,
    buyerCollateral,
    sellerCollateral,
    sellerCollateralStatus: row.seller_collateral_status || "PENDING",
    totalRequiredFromBuyer: formatMinorUnits(BigInt(row.invoice_amount_minor) + BigInt(row.buyer_collateral_minor)),
    description: row.description,
    deliveryTerms: row.delivery_terms,
    expectedDeliveryDate: row.expected_delivery_date,
    disputeReason: row.dispute_reason,
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMode: row.payment_provider_id ? "MOCK" : null,
    paymentProviderStatus: row.payment_provider_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at
  };
  if (includePaymentLink) {
    transaction.paymentLink = row.seller_collateral_status === "RECEIVED" ? `/pay/${row.escrow_id}` : null;
  }
  return transaction;
}

function withDatabaseTransaction(db, callback) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = callback();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

class TransactionService {
  constructor({ db, paymentProvider, appOrigin = "" }) {
    this.db = db;
    this.paymentProvider = paymentProvider;
    this.appOrigin = appOrigin.replace(/\/$/, "");
  }

  createTransaction(vendorId, input) {
    const vendorName = cleanString(input.vendorName, "Vendor name", 160);
    const buyerName = cleanString(input.buyerName, "Buyer name", 160);
    const buyerContact = cleanString(input.buyerContact, "Buyer email/contact", 254);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerContact);
    const isPhone = /^\+?[\d\s().-]{7,24}$/.test(buyerContact);
    if (!isEmail && !isPhone) {
      throw new TransactionError("Enter a valid buyer email or contact method");
    }
    const invoiceAmountMinor = parseAmountToMinorUnits(input.invoiceAmount);
    const currency = cleanString(input.currency || "USD", "Currency", 3).toUpperCase();
    if (!ALLOWED_CURRENCIES.has(currency)) throw new TransactionError("Choose a supported invoice currency");
    const description = cleanString(input.description, "Product/service description", 2000);
    const deliveryTerms = cleanString(input.deliveryTerms, "Delivery terms", 1000);
    if (!isValidDate(input.expectedDeliveryDate) || input.expectedDeliveryDate < new Date().toISOString().slice(0, 10)) {
      throw new TransactionError("Expected delivery date must be today or later");
    }

    const buyerCollateralMinor = calculateCollateralMinor(invoiceAmountMinor);
    const sellerCollateralMinor = calculateCollateralMinor(invoiceAmountMinor);
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    let escrowId;
    let inserted = false;

    for (let attempt = 0; attempt < 5 && !inserted; attempt += 1) {
      escrowId = `ESC-${new Date().getUTCFullYear()}-${randomBytes(16).toString("hex").toUpperCase()}`;
      try {
        withDatabaseTransaction(this.db, () => {
          this.db.prepare(`INSERT INTO transactions (
            escrow_id, payment_link_token_hash, vendor_id, vendor_name,
            buyer_name, buyer_contact, invoice_amount_minor, currency, buyer_collateral_minor,
            seller_collateral_minor, seller_collateral_status, description, delivery_terms, expected_delivery_date,
            status, payment_status, created_at, updated_at, expires_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CREATED', 'PENDING', ?, ?, ?)`)
            .run(escrowId, hashToken(escrowId), vendorId, vendorName,
              buyerName, buyerContact, invoiceAmountMinor, currency, buyerCollateralMinor,
              sellerCollateralMinor, "PENDING", description, deliveryTerms, input.expectedDeliveryDate,
              createdAt, createdAt, expiresAt);
          this.#recordEvent(escrowId, "TRANSACTION_CREATED", null, "CREATED", "PENDING", { collateralBps: COLLATERAL_BPS });
        });
        inserted = true;
      } catch (error) {
        if (!String(error.message).includes("UNIQUE constraint failed")) throw error;
      }
    }
    if (!inserted) throw new TransactionError("A unique transaction ID could not be generated; retry the request", 503);

    const row = this.db.prepare("SELECT * FROM transactions WHERE escrow_id = ?").get(escrowId);
    const transaction = rowToTransaction(row, { includePaymentLink: true });
    transaction.status = transaction.status || "SELLER_COLLATERAL_PENDING";
    transaction.paymentLink = null;
    if (this.appOrigin && transaction.paymentLink) transaction.paymentLink = `${this.appOrigin}${transaction.paymentLink}`;
    return transaction;
  }

  listVendorTransactions(vendorId) {
    return this.db.prepare("SELECT * FROM transactions WHERE vendor_id = ? ORDER BY created_at DESC")
      .all(vendorId)
      .map((storedRow) => {
        const row = this.#expireIfNeeded(storedRow);
        const transaction = rowToTransaction(row, { includePaymentLink: true });
        if (this.appOrigin && transaction.paymentLink) transaction.paymentLink = `${this.appOrigin}${transaction.paymentLink}`;
        return transaction;
      });
  }

  getByPaymentLink(token) {
    const row = this.#getRowByToken(token);
    if (row.seller_collateral_status !== "RECEIVED") {
      throw new TransactionError("Payment unavailable. The seller has not yet secured their required collateral. Please wait until the seller completes the security deposit.", 403);
    }
    this.#expireIfNeeded(row);
    return this.#publicTransaction(token);
  }

  async proceedToPayment(token) {
    let row = this.#getRowByToken(token);
    if (row.seller_collateral_status !== "RECEIVED") {
      throw new TransactionError("Payment unavailable. The seller has not yet secured their required collateral.", 403);
    }
    row = this.#expireIfNeeded(row);
    if (row.status === "BUYER_PAYMENT_PENDING" && row.payment_provider_id) {
      return { transaction: rowToTransaction(row, { includeVendorDetails: false }), payment: await this.paymentProvider.getPaymentStatus(row) };
    }
    if (row.status !== "SELLER_FUNDED") throw new TransactionError("This transaction cannot start payment in its current state", 409);

    const payment = await this.paymentProvider.createPayment({
      escrowId: row.escrow_id,
      amount: formatMinorUnits(BigInt(row.invoice_amount_minor) + BigInt(row.buyer_collateral_minor)),
      currency: row.currency
    });
    const updatedAt = new Date().toISOString();
    const changed = this.db.prepare(`UPDATE transactions SET status = 'BUYER_PAYMENT_PENDING', payment_provider_id = ?,
      payment_provider_status = ?, updated_at = ? WHERE escrow_id = ? AND status = 'SELLER_FUNDED'`)
      .run(payment.paymentProviderId, payment.paymentProviderStatus, updatedAt, row.escrow_id);
    if (changed.changes) {
      this.#recordEvent(row.escrow_id, "BUYER_PAYMENT_STARTED", "SELLER_FUNDED", "BUYER_PAYMENT_PENDING", "PENDING", { mode: "MOCK" });
    }
    row = this.#getRowByToken(token);
    return {
      transaction: rowToTransaction(row, { includeVendorDetails: false }),
      payment: await this.paymentProvider.getPaymentStatus(row),
      message: payment.displayMessage
    };
  }

  async confirmMockPayment(token) {
    let row = this.#getRowByToken(token);
    if (row.seller_collateral_status !== "RECEIVED") {
      throw new TransactionError("Payment unavailable. The seller has not yet secured their required collateral.", 403);
    }
    row = this.#expireIfNeeded(row);
    if (row.payment_provider_status === "MOCK_CONFIRMED" && ["BUYER_FUNDED", "ACTIVE"].includes(row.status)) {
      return this.#publicTransaction(token);
    }
    if (row.status !== "BUYER_PAYMENT_PENDING" || !row.payment_provider_id) {
      throw new TransactionError("Proceed to payment before recording a mock confirmation", 409);
    }

    const verification = await this.paymentProvider.verifyPayment(row, { simulateSuccess: true });
    if (!verification.verified) throw new TransactionError("Mock payment has not been confirmed", 409);
    const updatedAt = new Date().toISOString();
    withDatabaseTransaction(this.db, () => {
      const changed = this.db.prepare(`UPDATE transactions SET status = 'BUYER_FUNDED', payment_status = 'MOCK_CONFIRMED',
        payment_provider_status = ?, updated_at = ? WHERE escrow_id = ? AND status = 'BUYER_PAYMENT_PENDING'`)
        .run(verification.status, updatedAt, row.escrow_id);
      if (!changed.changes) throw new TransactionError("Payment status changed; reload the transaction", 409);
      this.#recordEvent(row.escrow_id, "BUYER_PAYMENT_RECEIVED", "BUYER_PAYMENT_PENDING", "BUYER_FUNDED", "MOCK_CONFIRMED", { mode: "MOCK" });
    });
    return this.#publicTransaction(token);
  }

  getPaymentStatus(token) {
    const row = this.#getRowByToken(token);
    return this.paymentProvider.getPaymentStatus(row);
  }

  listEventsForVendor(vendorId, escrowId) {
    this.#getVendorRow(vendorId, escrowId);
    return this.db.prepare(`SELECT event_type AS eventType, from_status AS fromStatus,
      to_status AS toStatus, payment_status AS paymentStatus, details_json AS details, created_at AS createdAt
      FROM transaction_events WHERE escrow_id = ? ORDER BY event_id`)
      .all(escrowId)
      .map((event) => ({ ...event, details: JSON.parse(event.details) }));
  }

  updateVendorStatus(vendorId, escrowId, status, reason = "") {
    const row = this.#getVendorRow(vendorId, escrowId);
    if (!new Set(["ACTIVE", "DELIVERED", "DISPUTED", "CANCELLED", "EXPIRED"]).has(status)) {
      throw new TransactionError("Vendor action is not supported", 400);
    }
    if (status === "EXPIRED" && new Date(row.expires_at).getTime() > Date.now()) {
      throw new TransactionError("This transaction has not reached its expiration time", 409);
    }
    if (status === "CANCELLED" && row.payment_status === "MOCK_CONFIRMED") {
      throw new TransactionError("Refund the mock payment before cancelling this transaction", 409);
    }
    if (status === "DISPUTED" && !reason.trim()) throw new TransactionError("A dispute reason is required");
    return this.#transition(row, status, `VENDOR_${status}`, { actor: "VENDOR", reason: reason.trim().slice(0, 500) });
  }

  async updateBuyerStatus(token, status, reason = "") {
    let row = this.#getRowByToken(token);
    if (row.seller_collateral_status !== "RECEIVED") {
      throw new TransactionError("Payment unavailable. The seller has not yet secured their required collateral. Please wait until the seller completes the security deposit.", 403);
    }
    row = this.#expireIfNeeded(row);
    if (!new Set(["DISPUTED", "COMPLETED"]).has(status)) {
      throw new TransactionError("Buyer action is not supported", 400);
    }
    if (status === "COMPLETED" && row.status !== "DELIVERED") {
      throw new TransactionError("The vendor must mark delivery before completion", 409);
    }
    if (status === "DISPUTED" && !reason.trim()) throw new TransactionError("A dispute reason is required");
    return this.#transition(row, status, `BUYER_${status}`, { actor: "BUYER_LINK", reason: reason.trim().slice(0, 500) });
  }

  depositSellerCollateral(vendorId, escrowId) {
    const row = this.#getVendorRow(vendorId, escrowId);
    if (row.status !== "CREATED" && row.status !== "SELLER_COLLATERAL_PENDING") {
      throw new TransactionError("Seller collateral can only be deposited before buyer payment is enabled", 409);
    }
    if (row.seller_collateral_status === "RECEIVED") {
      return rowToTransaction(this.db.prepare("SELECT * FROM transactions WHERE escrow_id = ?").get(escrowId), { includePaymentLink: true });
    }
    const updatedAt = new Date().toISOString();
    withDatabaseTransaction(this.db, () => {
      const changed = this.db.prepare(`UPDATE transactions SET seller_collateral_status = 'RECEIVED', status = 'SELLER_FUNDED', updated_at = ? WHERE escrow_id = ? AND status IN ('CREATED', 'SELLER_COLLATERAL_PENDING')`)
        .run(updatedAt, escrowId);
      if (!changed.changes) throw new TransactionError("Seller collateral status changed; reload and retry", 409);
      this.#recordEvent(escrowId, "SELLER_COLLATERAL_RECEIVED", row.status, "SELLER_FUNDED", "PENDING", { mode: "MOCK", amount: formatMinorUnits(row.seller_collateral_minor), currency: row.currency });
    });
    return rowToTransaction(this.db.prepare("SELECT * FROM transactions WHERE escrow_id = ?").get(escrowId), { includePaymentLink: true });
  }

  async refundVendorTransaction(vendorId, escrowId) {
    const row = this.#getVendorRow(vendorId, escrowId);
    if (!row.payment_provider_id || row.payment_status !== "MOCK_CONFIRMED") {
      throw new TransactionError("There is no confirmed mock payment to refund", 409);
    }
    if (!new Set(["PAYMENT_RECEIVED", "ACTIVE", "DELIVERED", "DISPUTED"]).has(row.status)) {
      throw new TransactionError("This transaction cannot be refunded in its current state", 409);
    }
    const refund = await this.paymentProvider.refundPayment(row);
    withDatabaseTransaction(this.db, () => {
      const changed = this.db.prepare(`UPDATE transactions SET status = 'CANCELLED', payment_status = 'MOCK_REFUNDED',
        payment_provider_status = ?, updated_at = ? WHERE escrow_id = ? AND status = ?`)
        .run(refund.status, new Date().toISOString(), escrowId, row.status);
      if (!changed.changes) throw new TransactionError("Transaction status changed; reload and retry", 409);
      this.#recordEvent(escrowId, "MOCK_REFUND_RECORDED", row.status, "CANCELLED", "MOCK_REFUNDED", { mode: "MOCK" });
    });
    return { transaction: rowToTransaction(this.#getVendorRow(vendorId, escrowId)), refund };
  }

  #recordEvent(escrowId, eventType, fromStatus, toStatus, paymentStatus, details) {
    this.db.prepare(`INSERT INTO transaction_events
      (escrow_id, event_type, from_status, to_status, payment_status, details_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(escrowId, eventType, fromStatus, toStatus, paymentStatus, JSON.stringify(details), new Date().toISOString());
  }

  #getVendorRow(vendorId, escrowId) {
    const row = this.db.prepare("SELECT * FROM transactions WHERE escrow_id = ? AND vendor_id = ?").get(escrowId, vendorId);
    if (!row) throw new TransactionError("Transaction not found", 404);
    return row;
  }

  #getRowByToken(token) {
    if (typeof token !== "string" || !/^ESC-\d{4}-[A-F0-9]{32}$/.test(token)) {
      throw new TransactionError("Payment link not found", 404);
    }
    const row = this.db.prepare("SELECT * FROM transactions WHERE payment_link_token_hash = ?")
      .get(hashToken(token));
    if (!row) throw new TransactionError("Payment link not found", 404);
    return row;
  }

  #publicTransaction(token) {
    const row = this.#getRowByToken(token);
    return rowToTransaction(row, { includeVendorDetails: false });
  }

  #expireIfNeeded(row) {
    if (new Date(row.expires_at).getTime() > Date.now() || !["CREATED", "SELLER_COLLATERAL_PENDING", "SELLER_FUNDED", "BUYER_PAYMENT_PENDING"].includes(row.status)) return row;
    return this.#transition(row, "EXPIRED", "TRANSACTION_EXPIRED", { actor: "SYSTEM", reason: "LINK_EXPIRED" });
  }

  #transition(row, status, eventType, details) {
    if (TERMINAL_STATES.has(row.status) || !ALLOWED_TRANSITIONS[row.status]?.has(status)) {
      throw new TransactionError(`Cannot change transaction from ${row.status} to ${status}`, 409);
    }
    const updatedAt = new Date().toISOString();
    withDatabaseTransaction(this.db, () => {
      const changed = this.db.prepare(`UPDATE transactions SET status = ?, updated_at = ?,
        dispute_reason = CASE WHEN ? = 'DISPUTED' THEN ? ELSE dispute_reason END
        WHERE escrow_id = ? AND status = ?`)
        .run(status, updatedAt, status, details.reason || "", row.escrow_id, row.status);
      if (!changed.changes) throw new TransactionError("Transaction status changed; reload and retry", 409);
      this.#recordEvent(row.escrow_id, eventType, row.status, status, row.payment_status, details);
    });
    return rowToTransaction(this.db.prepare("SELECT * FROM transactions WHERE escrow_id = ?").get(row.escrow_id));
  }
}

module.exports = {
  ALLOWED_CURRENCIES,
  COLLATERAL_BPS,
  TransactionError,
  TransactionService,
  calculateCollateralMinor,
  formatMinorUnits,
  parseAmountToMinorUnits
};
