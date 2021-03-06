const { dispatch, spawn, query } = require("nact");
const { system } = require("../system");
const { initDevice, connectDevice } = require("./tuya");
const { delay } = require("../utils/delay");
const { Strip } = require("./strip");

const onData = (actor, data) => {
  dispatch(actor, { type: "updateState", payload: data });
};

const onConnected = (state) => {
  state.connected = true;
};

const onDisconnected = (actor) => {
  dispatch(actor, { type: "reset" });
};

const onCrash = async (msg, error, ctx) => {
  console.log(`IOT service crashed, restarting... ${error}`);
  await delay(Math.random() * 1000 + 500);
  return ctx.reset;
};

const initialStateFunc = (ctx) => {
  dispatch(ctx.self, { type: "initialize" });
  return new Strip();
};

const initialize = async (state, ctx) => {
  const device = initDevice();

  device.on("data", (data) => onData(ctx.self, data));
  device.on("dp-refresh", (data) => onData(ctx.self, data));
  device.on("connected", () => onConnected(state));
  device.on("disconnected", () => onDisconnected(ctx.self));

  try {
    console.log("Initializing connection...");
    await connectDevice(device);
    state.device = device;
  } catch (error) {
    console.log(`Caught error while connecting: ${error.message}`);
    onDisconnected(ctx.self);
  }
};

const updateState = (state, data) => {
  state.updateData(data);
};

const setValue = async (state, data) => {
  return await state.setValue(data.name, data.value);
};

const getState = (state, ctx) => {
  dispatch(ctx.sender, { payload: state, type: "SUCCESS" });
};

const reset = () => {
  throw new Error("Resetting service...");
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
      case "setValue":
        await setValue(state, msg.payload);
        break;
      case "reset":
        reset();
        break;
    }

    return state;
  },
  "iot",
  { onCrash, initialStateFunc }
);

exports.iotService = iotService;

exports.getState = () => query(iotService, () => ({ type: "getState" }), 10000);
exports.setValue = (name, value) =>
  query(
    iotService,
    () => ({ type: "setValue", payload: { name: name, value: value } }),
    10000
  );
