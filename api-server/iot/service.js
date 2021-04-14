const { dispatch, spawn, query } = require("nact");
const merge = require("deepmerge");
const { system } = require("../system");
const { initDevice, connectDevice } = require("./tuya");
const { delay } = require("../utils/delay");

const onData = (actor, data) => {
  dispatch(actor, { type: "updateState", payload: data });
};

const onDisconnected = (actor) => {
  dispatch(actor, { type: "reset" });
};

const onCrash = async (msg, error, ctx) => {
  console.log("IOT service crashed, restarting...");
  await delay(Math.random() * 1000 + 500);
  return ctx.reset;
};

const initialStateFunc = (ctx) => {
  dispatch(ctx.self, { type: "initialize" });
  return { initialized: false };
};

const initialize = async (state, ctx) => {
  const device = initDevice();

  device.on("data", (data) => onData(ctx.self, data));
  device.on("dp-refresh", (data) => onData(ctx.self, data));
  device.on("disconnected", () => onDisconnected(ctx.self));

  console.log("Initializing connection...");
  await connectDevice(device);

  state.initialized = true;
};

const updateState = (state, data) => {
  state.rawData = merge(state.rawData, data);
};

const getState = (state, ctx) => {
  dispatch(ctx.sender, { payload: state, type: "SUCCESS" });
};

const reset = (service) => {
  service.reset();
};

const iotService = spawn(
  system,
  async (state, msg, ctx) => {
    switch (msg.type) {
      case "initialize":
        initialize(state, ctx);
        break;
      case "updateState":
        updateState(state, msg.payload);
        break;
      case "getState":
        getState(state, ctx);
        break;
      case "reset":
        reset(this);
        break;
    }

    return state;
  },
  "iot",
  { onCrash, initialStateFunc }
);

exports.iotService = iotService;

exports.getState = () => query(iotService, () => ({ type: "getState" }), 10000);
