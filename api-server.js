require("./api-server/application");
const { startServer } = require("./api-server/server");

const authConfig = require("./config/auth_config.json");

if (
  !authConfig.domain ||
  !authConfig.audience ||
  authConfig.audience === "YOUR_API_IDENTIFIER"
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

startServer();
