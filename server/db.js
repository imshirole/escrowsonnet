const fs = require("node:fs");
const { DatabaseSync } = require("node:sqlite");

function openDatabase(databasePath) {
  fs.mkdirSync(require("node:path").dirname(databasePath), { recursive: true });
  const db = new DatabaseSync(databasePath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS vendor_sessions (
      session_hash TEXT PRIMARY KEY,
      vendor_id TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS transactions (
      escrow_id TEXT PRIMARY KEY,
      payment_link_token_hash TEXT NOT NULL UNIQUE,
      vendor_id TEXT NOT NULL,
      vendor_name TEXT NOT NULL,
      buyer_name TEXT NOT NULL,
      buyer_contact TEXT NOT NULL,
      invoice_amount_minor INTEGER NOT NULL,
      currency TEXT NOT NULL,
      buyer_collateral_minor INTEGER NOT NULL,
      seller_collateral_minor INTEGER NOT NULL,
      seller_collateral_status TEXT NOT NULL DEFAULT 'PENDING',
      selected_asset TEXT,
      selected_network TEXT,
      demo_address TEXT,
      demo_qr_data TEXT,
      mock_payment_status TEXT,
      mock_payment_reference TEXT,
      seller_collateral_paid_at TEXT,
      description TEXT NOT NULL,
      delivery_terms TEXT NOT NULL,
      expected_delivery_date TEXT NOT NULL,
      dispute_reason TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      payment_provider_id TEXT,
      payment_provider_status TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS transactions_vendor_created
      ON transactions (vendor_id, created_at DESC);
    CREATE TABLE IF NOT EXISTS transaction_events (
      event_id INTEGER PRIMARY KEY AUTOINCREMENT,
      escrow_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      from_status TEXT,
      to_status TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      details_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS transaction_events_by_escrow
      ON transaction_events (escrow_id, event_id);
  `);
  const transactionColumns = new Set(db.prepare("PRAGMA table_info(transactions)").all().map((column) => column.name));
  const transactionMigrations = [
    ["seller_collateral_status", "TEXT NOT NULL DEFAULT 'PENDING'"],
    ["selected_asset", "TEXT"],
    ["selected_network", "TEXT"],
    ["demo_address", "TEXT"],
    ["demo_qr_data", "TEXT"],
    ["mock_payment_status", "TEXT"],
    ["mock_payment_reference", "TEXT"],
    ["seller_collateral_paid_at", "TEXT"]
  ];
  for (const [column, definition] of transactionMigrations) {
    if (!transactionColumns.has(column)) {
      db.exec(`ALTER TABLE transactions ADD COLUMN ${column} ${definition}`);
    }
  }
  return db;
}

module.exports = { openDatabase };