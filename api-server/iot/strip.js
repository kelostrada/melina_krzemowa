const merge = require("deepmerge");

const PINS = {
  socket1: "1",
  socket2: "2",
  socket3: "3",
  socketUSB: "7",
  currentElectricity: "18",
  currentPower: "19",
  currentVoltage: "20",
};

class Strip {
  id = "";
  connected = false;
  socket1 = false;
  socket2 = false;
  socket3 = false;
  socketUSB = false;
  rawData = {};
  currentElectricity = 0;
  currentPower = 0;
  currentVoltage = 0;

  constructor() {}

  updateData(rawData) {
    this.rawData = merge(this.rawData, rawData);
    this.fillFields();
  }

  fillFields() {
    this.id = this.rawData.devId;
    this.socket1 = this.getPinValue("socket1");
    this.socket2 = this.getPinValue("socket2");
    this.socket3 = this.getPinValue("socket3");
    this.socketUSB = this.getPinValue("socketUSB");
    this.currentElectricity = this.getPinValue("currentElectricity");
    this.currentPower = this.getPinValue("currentPower") / 10.0;
    this.currentVoltage = this.getPinValue("currentVoltage") / 10.0;
  }

  getPinValue(name) {
    return this.rawData.dps[PINS[name]];
  }
}

exports.Strip = Strip;
