import Device from "./Device.js";

export class TV extends Device {
  #volume;
  #isMuted;
  #currentChannelIndex;
  #input;
  #channels;

  static INPUTS = ["HDMI 1", "HDMI 2", "USB", "TV Antenna"];

  constructor(name, isOn = false) {
    super(name, "tv", isOn);
    this.#volume = 30;
    this.#isMuted = false;
    this.#currentChannelIndex = 0;
    this.#input = "TV Antenna";
    this.#channels = [
      { number: 1, name: "Discovery" },
      { number: 2, name: "National Geo" },
      { number: 3, name: "BBC World" },
      { number: 4, name: "CNN" },
      { number: 5, name: "TVP 1" },
      { number: 6, name: "TVP 2" },
      { number: 7, name: "Polsat" },
      { number: 8, name: "TVN" },
      { number: 9, name: "Cartoon Network" },
      { number: 10, name: "HBO" },
    ];
  }

  get volume() { return this.#volume; }
  get isMuted() { return this.#isMuted; }
  get currentChannel() { return this.#channels[this.#currentChannelIndex]; }
  get channels() { return [...this.#channels]; }
  get input() { return this.#input; }

  setVolume(value) {
    const v = Number(value);
    if (v < 0 || v > 100) throw new Error("Volume must be 0-100");
    this.#volume = v;
    this.#isMuted = v === 0;
  }

  toggleMute() {
    this.#isMuted = !this.#isMuted;
  }

  nextChannel() {
    this.#currentChannelIndex = (this.#currentChannelIndex + 1) % this.#channels.length;
    return this.currentChannel;
  }

  prevChannel() {
    this.#currentChannelIndex = (this.#currentChannelIndex - 1 + this.#channels.length) % this.#channels.length;
    return this.currentChannel;
  }

  goToChannel(number) {
    const idx = this.#channels.findIndex(c => c.number === number);
    if (idx === -1) throw new Error(`Channel ${number} not found`);
    this.#currentChannelIndex = idx;
    return this.currentChannel;
  }

  searchChannels(query) {
    return this.#channels.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      String(c.number).includes(query)
    );
  }

  setInput(input) {
    if (!TV.INPUTS.includes(input)) throw new Error(`Invalid input. Choose from: ${TV.INPUTS.join(", ")}`);
    this.#input = input;
  }

  addChannel(number, name) {
    if (this.#channels.find(c => c.number === number)) throw new Error(`Channel ${number} already exists`);
    this.#channels.push({ number, name });
    this.#channels.sort((a, b) => a.number - b.number);
  }

  removeChannel(number) {
    const idx = this.#channels.findIndex(c => c.number === number);
    if (idx === -1) throw new Error(`Channel ${number} not found`);
    this.#channels.splice(idx, 1);
    if (this.#currentChannelIndex >= this.#channels.length) {
      this.#currentChannelIndex = Math.max(0, this.#channels.length - 1);
    }
  }

  getInfo() {
    return {
      name: this.name,
      type: this.type,
      isOn: this.isOn,
      volume: this.#volume,
      isMuted: this.#isMuted,
      currentChannel: this.currentChannel,
      input: this.#input,
      totalChannels: this.#channels.length,
    };
  }
}
