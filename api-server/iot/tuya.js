const TuyAPI = require("tuyapi");
const devicesConfig = require("../../config/devices_config.json");

exports.initDevice = () => {
  const device = new TuyAPI({
    id: devicesConfig.power.id,
    key: devicesConfig.power.key,
    version: "3.3",
    issueRefreshOnConnect: true,
  });

  // Add event listeners
  device.on("connected", () => {
    console.log("Connected to device!");
  });

  device.on("disconnected", () => {
    console.log("Disconnected from device.");
  });

  device.on("error", (error) => {
    console.log("Error!", error);
  });

  device.on("dp-refresh", (data) => {
    console.log("DP_REFRESH data from device: ", data);
  });

  device.on("data", (data) => {
    console.log("Data from device:", data);
  });

  return device;
};

exports.connectDevice = async (device) => {
  // Find device on network
  await device.find().then(() => {
    // Connect to device
    device.connect();
  });
};
