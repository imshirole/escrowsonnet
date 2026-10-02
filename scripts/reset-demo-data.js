"use strict";

const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

if (process.env.NODE_ENV !== "development" || process.env.DATABASE_PATH) {
  throw new Error("Demo reset is restricted to the repository's local development database.");
}

const databasePath = path.resolve(__dirname, "../data/escrow-sonet.sqlite");
const db = new DatabaseSync(databasePath);

try {
  db.exec("BEGIN IMMEDIATE");
  db.exec("DELETE FROM transaction_events; DELETE FROM transactions; DELETE FROM vendor_sessions;");
  db.exec("COMMIT");
  console.log("Local demo transactions and vendor sessions were cleared.");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
} finally {
  db.close();
}
