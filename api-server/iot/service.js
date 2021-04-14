const { dispatch, spawn, query } = require("nact");
const merge = require("deepmerge");
const { system } = require("../system");
const { initDevice, connectDevice } = require("./tuya");

const updateState = (actor, data) => {
  dispatch(actor, { type: "updateState", payload: data });
};

const delay = (duration) =>
  new Promise((resolve) => setTimeout(() => resolve(), duration));

const onCrash = async (msg, error, ctx) => {
  console.log("IOT service crashed, restarting...");
  await delay(Math.random() * 1000 + 500);
  return ctx.reset;
};

const initialStateFunc = (ctx) => {
  dispatch(ctx.self, { type: "initialize" });
  return { initialized: false };
};

const iotService = spawn(
  system,
  async (state, msg, ctx) => {
    switch (msg.type) {
      case "initialize":
        const device = initDevice();

        device.on("data", (data) => updateState(ctx.self, data));
        device.on("dp-refresh", (data) => updateState(ctx.self, data));
        device.on("disconnected", () => {
          dispatch(ctx.self, { type: "reset" });
        });

        console.log("Initializing connection...");
        await connectDevice(device);

        state.initialized = true;

        break;
      case "updateState":
        state.rawData = merge(state.rawData, msg.payload);
        break;
      case "getState":
        dispatch(ctx.sender, { payload: state, type: "SUCCESS" });
        break;
      case "reset":
        this.reset();
        break;
    }

    return state;
  },
  "iot",
  { onCrash, initialStateFunc }
);

exports.iotService = iotService;

exports.getState = () => query(iotService, () => ({ type: "getState" }), 10000);
