const { dispatch, spawn, query } = require("nact");
const { system } = require("../system");
const { initDevice, connectDevice } = require("./tuya");

const updateState = (actor, data) => {
  dispatch(actor, { type: "updateState", payload: data });
};

const delay = (duration) =>
  new Promise((resolve) => setTimeout(() => resolve(), duration));

const reset = async (msg, error, ctx) => {
  await delay(Math.random() * 500 - 750);
  return ctx.reset;
};

const initState = (ctx) => {
  const device = initDevice();

  device.on("data", (data) => updateState(ctx.self, data));
  device.on("dp-refresh", (data) => updateState(ctx.self, data));
  device.on("disconnected", () => {
    dispatch(ctx.self, { type: "reset" });
  });

  // Let's not wait for connection - just initialize it.
  connectDevice(device);

  return { device: device.device.id };
};

const iotService = spawn(
  system,
  async (state, msg, ctx) => {
    switch (msg.type) {
      case "updateState":
        state.lastData = msg.payload;
        return state;
      case "getState":
        dispatch(ctx.sender, { payload: state, type: "SUCCESS" });
        return state;
      case "reset":
        this.reset();
        return state;
    }
  },
  "iot",
  { onCrash: reset, initialStateFunc: initState }
);

exports.iotService = iotService;

exports.getState = () => query(iotService, () => ({ type: "getState" }), 10000);
