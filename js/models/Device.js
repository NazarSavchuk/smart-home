export default class Device {
  constructor(name, type, isOn = false) {
    this.name = name;
    this.type = type;
    this.isOn = isOn;
    this.uuid = null;
    this.room = null;
  }

  turnOn() {
    this.isOn = true;
  }

  turnOff() {
    this.isOn = false;
  }

  toggle() {
    this.isOn = !this.isOn;
  }

  getInfo() {
    return { name: this.name, type: this.type, isOn: this.isOn };
  }
}
