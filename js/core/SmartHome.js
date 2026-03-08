export class SmartHome {
  constructor() {
    this.rooms = [
      {
        name: "Bathroom",
        id: "bathroom",
        currentTemp: 22,
        powerUsage: 0,
        heatingUsage: 0,
      },
      {
        name: "Living Room",
        id: "living-room",
        currentTemp: 24,
        powerUsage: 0,
        heatingUsage: 0,
      },
      {
        name: "Kitchen",
        id: "kitchen",
        currentTemp: 23,
        powerUsage: 0,
        heatingUsage: 0,
      },
      {
        name: "Bedroom",
        id: "bedroom",
        currentTemp: 21,
        powerUsage: 0,
        heatingUsage: 0,
      },
    ];
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
        uuid: "def457",
      },
      {
        name: "Floor Heating - Bedroom",
        type: "floor-heating",
        room: "bedroom",
        isOn: false,
        uuid: "ghi789",
      },
      {
        name: "Light",
        type: "light",
        room: "bedroom",
        isOn: false,
        uuid: "light123",
        brightness: 0,
      },
      {
        name: "Fan",
        type: "fan",
        room: "kitchen",
        isOn: false,
        uuid: "fan123",
      },
      {
        name: "Camera #1",
        type: "camera",
        room: "bedroom",
        isOn: false,
        uuid: "camera123",
      },
      {
        name: "Blinds",
        type: "blinds",
        room: "bedroom",
        isOn: false,
        uuid: "blinds123",
      },
      {
        name: "Socket #1",
        type: "socket",
        room: "kitchen",
        isOn: false,
        uuid: "kitchen123",
      },
      {
        name: "Lock #1",
        type: "lock",
        room: "living-room",
        isOn: false,
        uuid: "lock123",
      },
      {
        name: "Sensor #1",
        type: "sensor",
        room: "living-room",
        isOn: false,
        uuid: "sensor123",
      },
      {
        name: "Smart Speaker",
        type: "speaker",
        room: "living-room",
        isOn: false,
        uuid: "speaker123",
      },
      {
        name: "TV",
        type: "tv",
        room: "living-room",
        isOn: false,
        uuid: "tv123",
      },
    ];

    this.powerMap = {
      "floor-heating": 15,
      light: 10,
      camera: 8,
      socket: 50,
      blinds: 0,
      lock: 0,
      speaker: 15,
      tv: 80,
      fan: 35,
      sensor: 2,
    };
  }

  addDevice(device) {
    this.devices.push(device);
  }

  getDeviceStatus() {
    return this.devices.map(({ name, type, isOn, uuid }) => ({
      name,
      type,
      isOn,
      uuid,
    }));
  }

  getRoomMetrics(roomId) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) return null;

    const roomDevices = this.devices.filter((d) => d.room === roomId);
    const activeDevices = roomDevices.filter((d) => d.isOn);

    const powerUsage = activeDevices.reduce((sum, d) => {
      const base = this.powerMap[d.type] ?? 20;

      if (d.type === "light") {
        const brightness = d.brightness ?? 100;
        return sum + Math.round((base * brightness) / 100);
      }
      return sum + base;
    }, 0);

    const heatingOn = roomDevices.some(
      (d) => d.type === "floor-heating" && d.isOn,
    );
    const tempDelta = Math.random() * 0.4 - 0.2 + (heatingOn ? 0.1 : -0.05);
    room.currentTemp = Math.round((room.currentTemp + tempDelta) * 10) / 10;

    return {
      roomName: room.name,
      currentTemp: room.currentTemp,
      powerUsage,
      activeDevices: activeDevices.length,
      totalDevices: roomDevices.length,
    };
  }
  getAllRoomMetrics() {
    return this.rooms.map((r) => this.getRoomMetrics(r.id));
  }
}
