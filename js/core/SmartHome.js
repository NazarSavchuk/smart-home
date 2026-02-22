export class SmartHome {
  constructor() {
    this.devices = [
      {
        name: "Floor Heating - Bathroom",
        type: "floor-heating",
        room: "bathroom",
        isOn: false,
        uuid: "abc123",
      },
      {
        name: "Floor Heating - Living Room",
        type: "floor-heating",
        room: "living-room",
        isOn: true,
        uuid: "def456",
      },
      {
        name: "Floor Heating - Kitchen",
        type: "floor-heating",
        room: "kitchen",
        isOn: true,
        uuid: "def456",
      },
      {
        name: "Floor Heating - Bedroom",
        type: "floor-heating",
        room: "bedroom",
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
