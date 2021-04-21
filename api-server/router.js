const { checkJwt } = require("./jwt");
const { getState, setValue } = require("./iot/service");

exports.addRoutes = (app) => {
  app.get("/api/external", checkJwt, (req, res) => {
    res.send({
      msg: "Your access token was successfully validated!",
    });
  });

  app.get("/api/manage/status", checkJwt, async (req, res) => {
    const state = await getState();
    res.send({ payload: state.payload.toJSON() });
  });

  app.post("/api/manage/change", checkJwt, async (req, res) => {
    setValue(req.body.name, req.body.value);
    res.send({ status: "ok" });
  });
};
