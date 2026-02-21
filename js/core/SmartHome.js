export class SmartHome {
  constructor() {
    this.devices = [
      {
        name: "Floor Heating - Bathroom",
        type: "floor-heating",
        isOn: false,
        uuid: "abc123",
      },
      {
        name: "Floor Heating - Living Room",
        type: "floor-heating",
        isOn: true,
        uuid: "def456",
      },
      {
        name: "Floor Heating - Bedroom",
        type: "floor-heating",
        isOn: false,
        uuid: "ghi789",
      },
    ];
  }

  addDevice(device) {
    this.devices.push(device);
  }
  getDeviceStatus() {
    return this.devices.map((device) => ({
      name: device.name,
      type: device.type,
      isOn: device.isOn,
      uuid: device.uuid,
    }));
  }
}
