import { SmartHome } from "./core/SmartHome.js";

class SmartHomeUI {
  #home;
  #container;
  #addButton;
  #saveDeviceButton;
  #controlButtons;
  #deviceType;
  #deviceName;
  #devicesContainer;
  #roomSelect;

  constructor() {
    this.#home = new SmartHome();
    this.#container = document.getElementById("app");
    this.#addButton = document.getElementById("add-btn");
    this.#saveDeviceButton = document.getElementById("save-device-btn");
    this.#controlButtons = document.querySelector(".device-list__control-btns");
    this.#deviceType = document.getElementById("device-type-select");
    this.#deviceName = document.getElementById("device-name-input");
    this.#devicesContainer = document.getElementById("devices-container");
    this.#roomSelect = document.getElementById("room-select");

    this.#init();
  }

  #init() {
    this.#renderExistingDevices();
    this.#updateSaveButtonState();
    this.#bindEvents();
  }

  #renderExistingDevices() {
    this.#home.devices.forEach(({ name, type, room, uuid, isOn }) => {
      this.#renderDevice(name, type, room, uuid, isOn);
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
    const room = this.#roomSelect.value;
    const uuid = Math.random().toString(36).substring(2, 15);

    this.#home.devices.push({ name, type, room, uuid, isOn: true });
    this.#renderDevice(name, type, room, uuid, true);
  }

  #getRoomContainer(room) {
    const section = document.querySelector(`.${room}-devices`);
    return section?.querySelector(".grid") ?? null;
  }

  #renderDevice(name, type, room, uuid, isOn = true) {
    const roomContainer = this.#getRoomContainer(room);
    if (!roomContainer) return;

    const device = document.createElement("div");
    device.classList.add("card", "g-col-4");
    device.dataset.uuid = uuid;

    device.innerHTML = `
      <div class="card-body">
        <div class="card-header">
          <img src="img/${type}.png" alt="${type}">
          <h5 class="card-title col fs-6">${name}</h5>
        </div>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">UUID: ${uuid}</li>
        <li class="list-group-item">Type: ${type}</li>
        <li class="list-group-item">
          <div class="form-check form-switch">
            <input class="form-check-input toggle-switch" type="checkbox" role="switch" ${isOn ? "checked" : ""}>
            <label class="form-check-label toggle-label">${isOn ? "Turned On" : "Turned Off"}</label>
          </div>
        </li>
      </ul>
      ${
        type !== "floor-heating"
          ? `
      <div class="card-body">
        <button class="btn btn-danger remove-btn">Remove</button>
      </div>`
          : ""
      }
    `;

    const toggle = device.querySelector(".toggle-switch");
    const label = device.querySelector(".toggle-label");

    toggle.addEventListener("change", (e) => {
      const isOn = e.target.checked;
      label.textContent = isOn ? "Turned On" : "Turned Off";
      this.#toggleDeviceState(uuid, isOn);
    });

    if (type !== "floor-heating") {
      device
        .querySelector(".remove-btn")
        .addEventListener("click", () => this.#removeDevice(uuid, device));
    }

    roomContainer.appendChild(device);
  }

  #toggleDeviceState(uuid, isOn) {
    const device = this.#home.devices.find((d) => d.uuid === uuid);
    if (device) device.isOn = isOn;
  }

  #removeDevice(uuid, deviceEl) {
    const confirmed = confirm("Are you sure you want to remove this device?");
    if (!confirmed) return;

    this.#home.devices = this.#home.devices.filter((d) => d.uuid !== uuid);
    deviceEl.remove();
  }
}

new SmartHomeUI();
