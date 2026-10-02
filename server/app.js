const express = require("express");
const path = require("node:path");
const { createHash, randomBytes } = require("node:crypto");
const { MockPaymentProvider } = require("./payment-provider");
const { openDatabase } = require("./db");
const { TransactionError, TransactionService } = require("./transaction-service");

const SESSION_COOKIE = "escrow_vendor_session";

function cookieValue(header, name) {
  for (const part of String(header || "").split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === name) return decodeURIComponent(part.slice(separator + 1).trim());
  }
  return "";
}

function hashSession(token) {
  return createHash("sha256").update(token).digest("hex");
}

function createApp(options = {}) {
  const db = options.db || openDatabase(options.databasePath || "./data/escrow-sonet.sqlite");
  const paymentProvider = options.paymentProvider || new MockPaymentProvider();
  const service = options.transactionService || new TransactionService({
    db,
    paymentProvider,
    appOrigin: options.appOrigin || ""
  });
  const app = express();
  const secureCookies = options.secureCookies ?? process.env.NODE_ENV === "production";

  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.set("X-Frame-Options", "DENY");
    if (req.path.startsWith("/api/")) res.set("Cache-Control", "no-store");
    next();
  });
  app.use(express.json({ limit: "32kb" }));

  function requireVendor(req, res, next) {
    let sessionToken = cookieValue(req.headers.cookie, SESSION_COOKIE);
    let session = sessionToken
      ? db.prepare("SELECT vendor_id FROM vendor_sessions WHERE session_hash = ?").get(hashSession(sessionToken))
      : null;

    if (!session) {
      sessionToken = randomBytes(32).toString("base64url");
      session = { vendor_id: `VND-${randomBytes(16).toString("hex").toUpperCase()}` };
      db.prepare("INSERT INTO vendor_sessions (session_hash, vendor_id, created_at) VALUES (?, ?, ?)")
        .run(hashSession(sessionToken), session.vendor_id, new Date().toISOString());
      res.cookie(SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        secure: secureCookies,
        sameSite: "strict",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
    }
    req.vendorId = session.vendor_id;
    next();
  }

  app.get("/api/health", (req, res) => res.status(200).type("application/json").json({ ok: true, paymentMode: "MOCK", blockchainEnabled: false }));
  app.get("/api/config", (req, res) => res.status(200).type("application/json").json({
    ok: true,
    paymentMode: "MOCK",
    collateralBps: 3000,
    currencies: ["USD", "EUR", "GBP", "CAD", "AUD"],
    blockchainEnabled: false
  }));
  app.get("/api/vendor/session", requireVendor, (req, res) => {
    res.status(200).type("application/json").json({ ok: true, vendorId: req.vendorId });
  });
  app.post("/api/transactions", requireVendor, (req, res, next) => {
    try {
      const transaction = service.createTransaction(req.vendorId, req.body || {});
      res.status(201).type("application/json").json({ ok: true, transaction, paymentLink: transaction.paymentLink });
    } catch (error) {
      next(error);
    }
  });
  app.get("/api/transactions", requireVendor, (req, res) => {
    res.status(200).type("application/json").json({ ok: true, transactions: service.listVendorTransactions(req.vendorId) });
  });
  app.post("/api/transactions/:escrowId/deposit-collateral", requireVendor, (req, res, next) => {
    try {
      const transaction = service.depositSellerCollateral(req.vendorId, req.params.escrowId);
      res.status(200).type("application/json").json({ ok: true, transaction, paymentLink: transaction.paymentLink });
    } catch (error) {
      next(error);
    }
  });
  app.get("/api/transactions/:escrowId/events", requireVendor, (req, res, next) => {
    try {
      res.status(200).type("application/json").json({ ok: true, events: service.listEventsForVendor(req.vendorId, req.params.escrowId) });
    } catch (error) {
      next(error);
    }
  });
  app.post("/api/transactions/:escrowId/status", requireVendor, (req, res, next) => {
    try {
      const transaction = service.updateVendorStatus(req.vendorId, req.params.escrowId, req.body?.status, req.body?.reason || "");
      res.status(200).type("application/json").json({ ok: true, transaction });
    } catch (error) {
      next(error);
    }
  });
  app.post("/api/transactions/:escrowId/refund", requireVendor, async (req, res, next) => {
    try {
      const result = await service.refundVendorTransaction(req.vendorId, req.params.escrowId);
      res.status(200).type("application/json").json({ ok: true, ...result });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/payment-links/:token", (req, res, next) => {
    try {
      res.status(200).type("application/json").json({ ok: true, transaction: service.getByPaymentLink(req.params.token) });
    } catch (error) {
      next(error);
    }
  });
  app.post("/api/payment-links/:token/proceed", async (req, res, next) => {
    try {
      const result = await service.proceedToPayment(req.params.token);
      res.status(200).type("application/json").json({ ok: true, ...result });
    } catch (error) {
      next(error);
    }
  });
  app.get("/api/payment-links/:token/payment-status", async (req, res, next) => {
    try {
      const result = await service.getPaymentStatus(req.params.token);
      res.status(200).type("application/json").json({ ok: true, payment: result });
    } catch (error) {
      next(error);
    }
  });
  app.post("/api/payment-links/:token/mock-confirm", async (req, res, next) => {
    try {
      const result = await service.confirmMockPayment(req.params.token);
      res.status(200).type("application/json").json({ ok: true, transaction: result });
    } catch (error) {
      next(error);
    }
  });
  app.post("/api/payment-links/:token/status", async (req, res, next) => {
    try {
      if (req.body?.status !== "DISPUTED" && req.body?.status !== "COMPLETED") {
        return res.status(400).type("application/json").json({ ok: false, error: "Buyer action is not supported" });
      }
      const result = await service.updateBuyerStatus(req.params.token, req.body.status, req.body.reason || "");
      res.status(200).type("application/json").json({ ok: true, transaction: result });
    } catch (error) {
      next(error);
    }
  });

  app.get("/pay/:token", (req, res) => {
    if (!/^ESC-\d{4}-[A-F0-9]{32}$/.test(req.params.token)) return res.sendStatus(404);
    res.set("Cache-Control", "no-store");
    res.sendFile(path.resolve(process.cwd(), "pay.html"));
  });
  app.use((req, res, next) => {
    if (/^\/(node_modules|contracts|server|data)(\/|$)/.test(req.path)) return res.sendStatus(404);
    next();
  });
  app.use(express.static(process.cwd(), { dotfiles: "ignore", index: "index.html" }));

  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof TransactionError) return res.status(error.statusCode).type("application/json").json({ ok: false, error: error.message });
    console.error(error);
    res.status(500).type("application/json").json({ ok: false, error: "Request could not be completed" });
  });

  return { app, db, service };
}

module.exports = { createApp };
