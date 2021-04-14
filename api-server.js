require("./api-server/application");
const { startServer } = require("./api-server/server");

const authConfig = require("./src/config/auth.json");

if (
  !authConfig.domain ||
  !authConfig.audience ||
  authConfig.audience === "YOUR_API_IDENTIFIER"
) {
  console.log(
    "Exiting: Please make sure that src/config/auth.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

startServer();
