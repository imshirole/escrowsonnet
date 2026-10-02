# Escrow Sonet

Escrow Sonet currently implements transaction records and unique buyer payment links. The existing public page and dashboards are retained. Payment is mock-only: no cryptocurrency, card, bank transfer, or other funds are processed.

## Run

```sh
npm install
npm test
npm start
```

The local app serves at `http://localhost:3000`. Copy `.env.example` to `.env` only when changing the local port, host, database path, or public app origin. No payment-provider credentials are required in this phase.

## Transaction flow

Vendor creates an escrow from the existing Direct Links view or public Create Escrow modal. The server validates and stores invoice amount separately from buyer and seller collateral; each collateral is calculated as 30% of the invoice using integer minor units. The server returns a random `ESC-<year>-<128-bit-random-id>` that is also the payment-link capability. It is not a sequential database key.

The buyer opens `/pay/<escrowId>` without signing in, reviews the transaction, and selects Proceed to Payment. The mock provider creates a mock payment record; the buyer can explicitly confirm the mock result for testing. The UI and API label this as mock-only. A confirmed mock payment advances the transaction to `PAYMENT_RECEIVED`; the vendor activates it to `ACTIVE`. Delivery, dispute, completion, cancellation, expiry, and mock refund transitions are tracked separately from payment-provider state.

## Boundaries

The transaction service owns validation, collateral calculation, statuses, payment-link lookup, and history. It depends on the `PaymentProvider` interface (`createPayment`, `getPaymentStatus`, `verifyPayment`, `refundPayment`); `MockPaymentProvider` is the only implementation. A future provider can implement that interface without putting provider-specific payment logic in the transaction state machine.

SQLite stores transactions, vendor browser sessions, payment-provider references, and append-only status events. Buyer access is limited to the transaction referenced by the random link. Vendor transaction listing is scoped to an unguessable, HttpOnly, SameSite session cookie; the cookie secret is stored as a hash. Buyer-facing responses omit buyer contact details. This is a prototype session boundary, not a replacement for account authentication or production abuse controls.

## API

- `GET /api/health` and `GET /api/config` report mock mode and the collateral rule.
- `GET /api/vendor/session` creates or returns a vendor browser session.
- `POST /api/transactions` creates an escrow for the current vendor session.
- `GET /api/transactions` lists that vendor session's records.
- `GET /api/transactions/:escrowId/events` returns status history for the owning vendor session.
- `POST /api/transactions/:escrowId/status` applies a vendor transition.
- `POST /api/transactions/:escrowId/refund` records a mock refund.
- `GET /api/payment-links/:token` returns the buyer-safe transaction view.
- `POST /api/payment-links/:token/proceed` starts a mock payment.
- `GET /api/payment-links/:token/payment-status` reads the mock provider status.
- `POST /api/payment-links/:token/mock-confirm` records a mock confirmation only.
- `POST /api/payment-links/:token/status` allows buyer dispute or completion actions.

The present account login/registration forms remain prototype-only. Real payment providers, blockchain integration, identity verification, notification delivery, and production session/abuse controls are later phases.
