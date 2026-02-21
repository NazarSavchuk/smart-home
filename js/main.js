import { SmartHome } from "./core/SmartHome.js";

class SmartHomeUI {
  #home;
  #container;
  #addButton;
  #saveDeviceButton;
  #controlButtons;
  #deviceType;
  #deviceName;

  constructor() {
    this.#home = new SmartHome();
    this.#container = document.getElementById("app");
    this.#addButton = document.getElementById("add-btn");
    this.#saveDeviceButton = document.getElementById("save-device-btn");
    this.#controlButtons = document.querySelector(".device-list__control-btns");
    this.#deviceType = document.getElementById("device-type-select");
    this.#deviceName = document.getElementById("device-name-input");

    this.#init();
  }

  #init() {
    this.#renderExistingDevices();
    this.#updateSaveButtonState();
    this.#bindEvents();
  }

  #renderExistingDevices() {
    this.#home.devices.forEach(({ name, type, uuid }) => {
      this.#renderDevice(name, type, uuid);
    });
  }
  #bindEvents() {
    this.#addButton.addEventListener("click", () => this.#toggleVisibility());

    this.#deviceName.addEventListener("input", () =>
      this.#updateSaveButtonState(),
    );

    this.#saveDeviceButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.#toggleVisibility();
      this.#addDevice();
    });
  }

  #toggleVisibility() {
    this.#controlButtons.classList.toggle("hidden");
    this.#addButton.classList.toggle("hidden");
  }

  #updateSaveButtonState() {
    this.#saveDeviceButton.disabled = this.#deviceName.value.trim() === "";
  }

  #addDevice() {
    const name = this.#deviceName.value;
    const type = this.#deviceType.value;
    const uuid = Math.random().toString(36).substring(2, 15);

    this.#home.devices.push({ name, type, uuid });
    this.#renderDevice(name, type, uuid);
  }

  #renderDevice(name, type, uuid) {
    const device = document.createElement("div");
    device.dataset.uuid = uuid;
    device.textContent = `${name} - ${type} - ${uuid}`;

    if (type !== "floor-heating") {
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", () =>
        this.#removeDevice(uuid, device),
      );
      device.appendChild(removeButton);
    }

    this.#container.appendChild(device);
  }

  #removeDevice(uuid, deviceEl) {
    const confirmed = confirm("Are you sure you want to remove this device?");
    if (!confirmed) return;

    this.#home.devices = this.#home.devices.filter((d) => d.uuid !== uuid);
    deviceEl.remove();
  }
}

new SmartHomeUI();
