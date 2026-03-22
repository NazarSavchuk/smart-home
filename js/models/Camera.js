import Device from "./Device.js";

export class Camera extends Device {
  #mode;
  #isRecording;
  #motionDetected;
  #resolution;
  #nightVision;

  static MODES = ["idle", "monitoring", "recording", "motion-detect"];
  static RESOLUTIONS = ["720p", "1080p", "4K"];

  constructor(name, isOn = false) {
    super(name, "camera", isOn);
    this.#mode = "idle";
    this.#isRecording = false;
    this.#motionDetected = false;
    this.#resolution = "1080p";
    this.#nightVision = false;
  }

  get mode() { return this.#mode; }
  get isRecording() { return this.#isRecording; }
  get motionDetected() { return this.#motionDetected; }
  get resolution() { return this.#resolution; }
  get nightVision() { return this.#nightVision; }

  setMode(mode) {
    if (!Camera.MODES.includes(mode)) throw new Error(`Mode must be one of: ${Camera.MODES.join(", ")}`);
    this.#mode = mode;
    this.#isRecording = mode === "recording";
    this.isOn = mode !== "idle";
  }

  setResolution(res) {
    if (!Camera.RESOLUTIONS.includes(res)) throw new Error(`Resolution must be: ${Camera.RESOLUTIONS.join(", ")}`);
    this.#resolution = res;
  }

  toggleNightVision() {
    this.#nightVision = !this.#nightVision;
    return this.#nightVision;
  }

  // Simulate motion event
  triggerMotion() {
    this.#motionDetected = true;
    if (this.#mode === "motion-detect") {
      this.#isRecording = true;
    }
    setTimeout(() => { this.#motionDetected = false; this.#isRecording = this.#mode === "recording"; }, 5000);
  }

  getInfo() {
    return {
      name: this.name,
      type: this.type,
      isOn: this.isOn,
      mode: this.#mode,
      isRecording: this.#isRecording,
      motionDetected: this.#motionDetected,
      resolution: this.#resolution,
      nightVision: this.#nightVision,
    };
  }
}
