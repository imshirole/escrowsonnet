const path = require("node:path");

function loadConfig() {
  return {
    port: Number(process.env.PORT || 3000),
    host: process.env.HOST || "127.0.0.1",
    databasePath: path.resolve(process.env.DATABASE_PATH || "./data/escrow-sonet.sqlite"),
    appOrigin: process.env.APP_BASE_URL || ""
  };
}

module.exports = { loadConfig };