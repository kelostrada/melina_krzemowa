const merge = require("deepmerge");

const DPS = {
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
  device = null;
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
    this.socket1 = this.getDpsValue("socket1");
    this.socket2 = this.getDpsValue("socket2");
    this.socket3 = this.getDpsValue("socket3");
    this.socketUSB = this.getDpsValue("socketUSB");
    this.currentElectricity = this.getDpsValue("currentElectricity");
    this.currentPower = this.getDpsValue("currentPower") / 10.0;
    this.currentVoltage = this.getDpsValue("currentVoltage") / 10.0;
  }

  getDpsValue(name) {
    return this.rawData.dps[DPS[name]];
  }

  async setValue(name, value) {
    return await this.device.set({ set: value, dps: DPS[name] });
  }

  toJSON() {
    return {
      id: this.id,
      connected: this.connected,
      socket1: this.socket1,
      socket2: this.socket2,
      socket3: this.socket3,
      socketUSB: this.socketUSB,
      currentElectricity: this.currentElectricity,
      currentPower: this.currentPower,
      currentVoltage: this.currentVoltage,
    };
  }
}

exports.Strip = Strip;
