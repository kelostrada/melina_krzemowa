const { checkJwt } = require("./jwt");
const { getState } = require("./iot/service");

exports.addRoutes = (app) => {
  app.get("/api/external", checkJwt, (req, res) => {
    res.send({
      msg: "Your access token was successfully validated!",
    });
  });

  app.get("/api/manage/status", checkJwt, async (req, res) => {
    const state = await getState();
    res.send(state);
  });
};
