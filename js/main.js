import { SmartHome } from "./core/SmartHome.js";
import { CustomSelect } from "./components/CustomSelect.js";
import { Light } from "./models/Light.js";
import { TV } from "./models/TV.js";
import { Blinds } from "./models/Blinds.js";
import { Camera } from "./models/Camera.js";
import { saveDevicesToStorage, loadDevicesIntoHome } from "./services/deviceStorage.js";
import { mountDeviceCard } from "./ui/deviceCard.js";
import { buildSettingsPanelHtml, bindSettingsPanelEvents } from "./ui/settingsModal.js";

class SmartHomeUI {
  #home;
  #saveDeviceButton;
  #controlButtons;
  #deviceType;
  #deviceName;
  #roomSelect;
  #metricsInterval;
  #modal;
  #modalContent;

  constructor() {
    this.#home = new SmartHome();
    this.#saveDeviceButton = document.getElementById("save-device-btn");
    this.#controlButtons = document.querySelector(".device-list__control-btns");

    const selectRoot = document.querySelector("[data-id='device-type-select']");
    this.#deviceType = new CustomSelect(selectRoot);

    this.#deviceName = document.getElementById("device-name-input");

    const roomSelectRoot = document.querySelector("[data-id='room-select']");
    this.#roomSelect = new CustomSelect(roomSelectRoot);

    this.#modal = document.getElementById("device-modal");
    this.#modalContent = document.getElementById("modal-body");

    this.#init();
  }

  #init() {
    loadDevicesIntoHome(this.#home);
    this.#renderExistingDevices();
    this.#updateSaveButtonState();
    this.#bindEvents();
    this.#updateRoomMetrics();
    this.#metricsInterval = setInterval(() => this.#updateRoomMetrics(), 3000);
  }

  #persist() {
    saveDevicesToStorage(this.#home.devices);
  }

  #syncDevicePower(uuid, isOn) {
    const device = this.#home.getDeviceByUuid(uuid);
    if (device) {
      device.isOn = isOn;
      this.#persist();
    }
  }

  #updateRoomMetrics() {
    const allMetrics = this.#home.getAllRoomMetrics();
    allMetrics.forEach((metrics) => {
      if (!metrics) return;
      const roomId = this.#home.rooms.find((r) => r.name === metrics.roomName)?.id;
      if (!roomId) return;
      const section = document.querySelector(`.${roomId}-devices`);
      if (!section) return;
      const infoEl = section.querySelector(".room-info__info");
      if (!infoEl) return;
      infoEl.innerHTML = `
        <span class="metric">
          <img src="img/termometr.svg" alt="Temperature" class="metric-icon" />
          <span>${metrics.currentTemp}°C</span>
        </span>
        <span class="metric">
          <img src="img/electricity.svg" alt="Power" class="metric-icon" />
          <span>${metrics.powerUsage} W</span>
        </span>
        <span class="metric">
          <i class="fa-solid fa-mobile-screen" style="color: rgb(116, 192, 252);"></i>
          <span>${metrics.activeDevices}/${metrics.totalDevices} active</span>
        </span>
      `;
    });
  }

  #renderExistingDevices() {
    this.#home.devices.forEach((dev) => {
      this.#renderDevice(dev.name, dev.type, dev.room, dev.uuid, dev.isOn, dev.brightness, dev.color, dev.mode);
    });
  }

  #bindEvents() {
    this.#deviceName.addEventListener("input", () => this.#updateSaveButtonState());
    this.#saveDeviceButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.#toggleVisibility();
      this.#addDevice();
    });

    this.#modal?.addEventListener("click", (e) => {
      if (e.target === this.#modal) this.#closeModal();
    });
    document.getElementById("modal-close-btn")?.addEventListener("click", () => this.#closeModal());
    window.addEventListener("beforeunload", () => this.#persist());
  }

  #toggleVisibility() {
    this.#controlButtons.classList.toggle("hidden");
  }

  #updateSaveButtonState() {
    this.#saveDeviceButton.disabled = this.#deviceName.value.trim() === "";
  }

  #addDevice() {
    const name = this.#deviceName.value;
    const type = this.#deviceType.value;
    const room = this.#roomSelect.value;
    const uuid = Math.random().toString(36).substring(2, 15);

    let newDevice;
    if (type === "light") {
      newDevice = new Light(name);
    } else if (type === "tv") {
      newDevice = new TV(name);
    } else if (type === "blinds") {
      newDevice = new Blinds(name);
    } else if (type === "camera") {
      newDevice = new Camera(name);
    } else {
      newDevice = { name, type, room, uuid, isOn: false };
    }

    newDevice.uuid = uuid;
    newDevice.room = room;

    this.#home.devices.push(newDevice);
    this.#renderDevice(name, type, room, uuid, false, newDevice.brightness, newDevice.color, newDevice.mode);
    this.#updateRoomMetrics();
    this.#deviceName.value = "";
    this.#updateSaveButtonState();
    this.#persist();
  }

  #getRoomContainer(room) {
    const section = document.querySelector(`.${room}-devices`);
    return section?.querySelector(".devices-container") ?? null;
  }

  #renderDevice(name, type, room, uuid, isOn = false, brightness = 0, color = "#ffffff", mode = "normal") {
    mountDeviceCard({
      home: this.#home,
      roomContainer: this.#getRoomContainer(room),
      persist: () => this.#persist(),
      updateMetrics: () => this.#updateRoomMetrics(),
      openSettings: (u, t) => this.#openSettings(u, t),
      syncDevicePower: (u, on) => this.#syncDevicePower(u, on),
      removeDevice: (u, el) => this.#removeDevice(u, el),
      name,
      type,
      room,
      uuid,
      isOn,
      brightness,
      color,
      mode,
    });
  }

  #openSettings(uuid, type) {
    const device = this.#home.getDeviceByUuid(uuid);
    if (!device) return;

    const html = buildSettingsPanelHtml(type, device);
    document.getElementById("modal-title").textContent = `${device.name} — Settings`;
    this.#modalContent.innerHTML = html;
    this.#modal.classList.remove("hidden");
    this.#modal.classList.add("visible");

    bindSettingsPanelEvents(uuid, type, device, {
      persist: () => this.#persist(),
      updateMetrics: () => this.#updateRoomMetrics(),
      syncDevicePower: (u, on) => this.#syncDevicePower(u, on),
    });
  }

  #closeModal() {
    this.#modal.classList.remove("visible");
    this.#modal.classList.add("hidden");
  }

  #removeDevice(uuid, deviceEl) {
    if (!confirm("Are you sure you want to remove this device?")) return;
    this.#home.devices = this.#home.devices.filter((d) => d.uuid !== uuid);
    deviceEl.remove();
    this.#updateRoomMetrics();
    this.#persist();
  }
}

new SmartHomeUI();
