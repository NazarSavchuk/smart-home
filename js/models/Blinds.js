import Device from "./Device.js";

export class Blinds extends Device {
  #position; // 0 = closed, 100 = fully open
  #isMoving;
  #tiltAngle; // 0-90 degrees

  constructor(name, isOn = false) {
    super(name, "blinds", isOn);
    this.#position = 0;
    this.#isMoving = false;
    this.#tiltAngle = 0;
  }

  get position() { return this.#position; }
  get isMoving() { return this.#isMoving; }
  get tiltAngle() { return this.#tiltAngle; }

  setPosition(value) {
    const v = Number(value);
    if (v < 0 || v > 100) throw new Error("Position must be 0-100");
    this.#position = v;
    this.isOn = v > 0;
    this.#isMoving = true;
    setTimeout(() => { this.#isMoving = false; }, 1500);
  }

  open() { this.setPosition(100); }
  close() { this.setPosition(0); }

  setTilt(angle) {
    const a = Number(angle);
    if (a < 0 || a > 90) throw new Error("Tilt must be 0-90 degrees");
    this.#tiltAngle = a;
  }

  getInfo() {
    return {
      name: this.name,
      type: this.type,
      isOn: this.isOn,
      position: this.#position,
      tiltAngle: this.#tiltAngle,
      isMoving: this.#isMoving,
    };
  }
}
