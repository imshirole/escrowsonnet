const { createApp } = require("./app");
const { loadConfig } = require("./config");

const config = loadConfig();
const { app, db } = createApp({
  databasePath: config.databasePath,
  appOrigin: config.appOrigin
});
const server = app.listen(config.port, config.host, () => {
  console.log(`Escrow Sonet listening at http://${config.host}:${config.port}`);
  console.log("Payment mode: MOCK only. No blockchain or real payment processing is enabled.");
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
