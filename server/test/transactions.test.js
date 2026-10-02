const assert = require("node:assert/strict");
const { after, test } = require("node:test");
const { createApp } = require("../app");
const { openDatabase } = require("../db");

const db = openDatabase(":memory:");
const { app } = createApp({ db });
const server = app.listen(0, "127.0.0.1");
const serverReady = new Promise((resolve, reject) => {
  server.once("listening", resolve);
  server.once("error", reject);
});
const baseUrl = serverReady.then(() => `http://127.0.0.1:${server.address().port}`);

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  db.close();
});

async function request(path, options = {}) {
  return fetch(`${await baseUrl}${path}`, options);
}

async function createVendorSession() {
  const response = await request("/api/vendor/session");
  assert.equal(response.status, 200);
  const cookie = response.headers.get("set-cookie");
  assert.ok(cookie);
  return cookie.split(";")[0];
}

function expectedDeliveryDate() {
  return new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

test("seller collateral must be funded before a buyer payment link becomes visible", async () => {
  const vendorCookie = await createVendorSession();
  const createdResponse = await request("/api/transactions", {
    method: "POST",
    headers: { Cookie: vendorCookie, "Content-Type": "application/json" },
    body: JSON.stringify({
      vendorName: "Northwind Supplies",
      buyerName: "Ada Buyer",
      buyerContact: "ada@example.test",
      invoiceAmount: "10000.00",
      currency: "USD",
      description: "Industrial valves",
      deliveryTerms: "Delivered duty paid",
      expectedDeliveryDate: expectedDeliveryDate()
    })
  });
  assert.equal(createdResponse.status, 201);
  const createdPayload = await createdResponse.json();
  assert.equal(createdPayload.ok, true);
  const { transaction: created } = createdPayload;
  assert.match(created.escrowId, /^ESC-\d{4}-[A-F0-9]{32}$/);
  assert.equal(created.invoiceAmount, "10000.00");
  assert.equal(created.buyerCollateral, "3000.00");
  assert.equal(created.sellerCollateral, "3000.00");
  assert.equal(created.status, "CREATED");
  assert.equal(created.paymentStatus, "PENDING");
  assert.equal(created.paymentLink, null);

  const blockedBeforeDeposit = await request(`/api/payment-links/${created.escrowId}`);
  assert.equal(blockedBeforeDeposit.status, 403);

  const depositResponse = await request(`/api/transactions/${created.escrowId}/deposit-collateral`, {
    method: "POST",
    headers: { Cookie: vendorCookie }
  });
  assert.equal(depositResponse.status, 200);
  const depositPayload = await depositResponse.json();
  assert.equal(depositPayload.ok, true);
  assert.equal(depositPayload.transaction.status, "SELLER_FUNDED");
  assert.equal(depositPayload.transaction.sellerCollateralStatus, "RECEIVED");
  assert.equal(depositPayload.transaction.paymentLink, `/pay/${created.escrowId}`);

  const token = created.escrowId;
  const buyerResponse = await request(`/api/payment-links/${token}`);
  assert.equal(buyerResponse.status, 200);
  const buyerView = (await buyerResponse.json()).transaction;
  assert.equal(buyerView.escrowId, created.escrowId);
  assert.equal(buyerView.buyer.contact, undefined);
  assert.equal(buyerView.totalRequiredFromBuyer, "13000.00");

  const firstProceed = await request(`/api/payment-links/${token}/proceed`, { method: "POST" });
  assert.equal(firstProceed.status, 200);
  const firstProceedPayload = await firstProceed.json();
  assert.equal(firstProceedPayload.transaction.status, "BUYER_PAYMENT_PENDING");
  assert.equal(firstProceedPayload.payment.mode, "MOCK");
  assert.equal(firstProceedPayload.payment.status, "PENDING");

  const confirmation = await request(`/api/payment-links/${token}/mock-confirm`, { method: "POST" });
  assert.equal(confirmation.status, 200);
  const confirmedTransaction = (await confirmation.json()).transaction;
  assert.equal(confirmedTransaction.paymentStatus, "MOCK_CONFIRMED");
  assert.equal(confirmedTransaction.status, "BUYER_FUNDED");

  const vendorStatusResponse = await request(`/api/transactions/${created.escrowId}/status`, {
    method: "POST",
    headers: { Cookie: vendorCookie, "Content-Type": "application/json" },
    body: JSON.stringify({ status: "ACTIVE" })
  });
  assert.equal(vendorStatusResponse.status, 200);
  assert.equal((await vendorStatusResponse.json()).transaction.status, "ACTIVE");

  const disputeResponse = await request(`/api/payment-links/${token}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "DISPUTED", reason: "Delivery date needs review" })
  });
  assert.equal(disputeResponse.status, 200);
  assert.equal((await disputeResponse.json()).transaction.disputeReason, "Delivery date needs review");

  const otherVendorCookie = await createVendorSession();
  const otherVendorList = await request("/api/transactions", { headers: { Cookie: otherVendorCookie } });
  assert.equal((await otherVendorList.json()).transactions.length, 0);

  const invalidResponse = await request("/api/transactions", {
    method: "POST",
    headers: { Cookie: vendorCookie, "Content-Type": "application/json" },
    body: JSON.stringify({ vendorName: "Test", buyerName: "Test", buyerContact: "bad", invoiceAmount: "100.001" })
  });
  assert.equal(invalidResponse.status, 400);
});

test("invalid or sequential database IDs are not accepted as public payment links", async () => {
  const response = await request("/api/payment-links/1");
  assert.equal(response.status, 404);
});
