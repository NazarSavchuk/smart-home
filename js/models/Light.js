import Device from "./Device.js";

export class Light extends Device {
  #brightness;
  #color;
  #mode;

  constructor(name, isOn = false) {
    super(name, "light", isOn);
    this.#brightness = 0;
    this.#color = "#ffffff";
    this.#mode = "normal";
  }

  get brightness() { return this.#brightness; }
  set brightness(value) {
    const v = Number(value);
    if (v < 0 || v > 100) throw new Error("Brightness must be 0-100");
    this.#brightness = v;
    this.isOn = v > 0;
  }

  get color() { return this.#color; }
  get mode() { return this.#mode; }

  setBrightness(value) {
    this.brightness = value;
  }

  setColor(hex) {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) throw new Error("Invalid hex color");
    this.#color = hex;
  }

  setMode(mode) {
    const modes = ["normal", "night", "party"];
    if (!modes.includes(mode)) throw new Error(`Mode must be one of: ${modes.join(", ")}`);
    this.#mode = mode;
    if (mode === "night") { this.#brightness = 20; this.#color = "#ff6600"; }
    else if (mode === "party") { this.#brightness = 100; this.#color = "#ff00ff"; }
    else { this.#brightness = 80; this.#color = "#ffffff"; }
    this.isOn = this.#brightness > 0;
  }

  getInfo() {
    return {
      name: this.name,
      type: this.type,
      isOn: this.isOn,
      brightness: this.#brightness,
      color: this.#color,
      mode: this.#mode,
    };
  }
}
