const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const authConfig = require("../src/config/auth.json");
const { addRoutes } = require("./router");

const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;

exports.startServer = () => {
  const app = express();

  app.use(morgan("dev"));
  app.use(helmet());
  app.use(cors({ origin: appOrigin }));

  // parse application/json
  app.use(express.json());

  // TODO: implement rotuer as a middleware maybe?
  addRoutes(app);

  app.listen(port, () => console.log(`API Server listening on port ${port}`));

  return app;
};
