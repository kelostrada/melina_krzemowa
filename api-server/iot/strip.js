const merge = require("deepmerge");

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
    this.socket1 = this.rawData.dps["1"];
    this.socket2 = this.rawData.dps["2"];
    this.socket3 = this.rawData.dps["3"];
    this.socketUSB = this.rawData.dps["7"];
    this.currentElectricity = this.rawData.dps["18"];
    this.currentPower = this.rawData.dps["19"] / 10.0;
    this.currentVoltage = this.rawData.dps["20"] / 10.0;
  }
}

exports.Strip = Strip;
