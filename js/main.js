import { SmartHome } from "./core/SmartHome.js";
import { CustomSelect } from "./components/CustomSelect.js";

class SmartHomeUI {
  #home;
  #container;
  #saveDeviceButton;
  #controlButtons;
  #deviceType;
  #deviceName;
  #devicesContainer;
  #roomSelect;
  #metricsInterval;

  constructor() {
    this.#home = new SmartHome();
    this.#container = document.getElementById("app");
    this.#saveDeviceButton = document.getElementById("save-device-btn");
    this.#controlButtons = document.querySelector(".device-list__control-btns");

    const selectRoot = document.querySelector("[data-id='device-type-select']");
    this.#deviceType = new CustomSelect(selectRoot);

    this.#deviceName = document.getElementById("device-name-input");
    this.#devicesContainer = document.getElementById("devices-container");

    const roomSelectRoot = document.querySelector("[data-id='room-select']");
    this.#roomSelect = new CustomSelect(roomSelectRoot);

    this.#init();
  }

  #init() {
    this.#renderExistingDevices();
    this.#updateSaveButtonState();
    this.#bindEvents();
    this.#updateRoomMetrics();
    this.#metricsInterval = setInterval(() => {
      this.#updateRoomMetrics();
    }, 3000);
  }

  #updateRoomMetrics() {
    const allMetrics = this.#home.getAllRoomMetrics();

    allMetrics.forEach((metrics) => {
      if (!metrics) return;

      const roomId = this.#home.rooms.find(
        (r) => r.name === metrics.roomName,
      )?.id;
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
          <i class="fa-solid fa-mobile-screen" style="color: rgb(116, 192, 252);"></i><span>${metrics.activeDevices}/${metrics.totalDevices} active </span>
        </span>
      `;
    });
  }

  #renderExistingDevices() {
    this.#home.devices.forEach(({ name, type, room, uuid, isOn }) => {
      this.#renderDevice(name, type, room, uuid, isOn);
    });
  }

  #bindEvents() {
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
  }

  #updateSaveButtonState() {
    this.#saveDeviceButton.disabled = this.#deviceName.value.trim() === "";
  }

  #addDevice() {
    const name = this.#deviceName.value;
    const type = this.#deviceType.value;
    const room = this.#roomSelect.value;
    const uuid = Math.random().toString(36).substring(2, 15);

    this.#home.devices.push({ name, type, room, uuid, isOn: false });
    this.#renderDevice(name, type, room, uuid, false);
    this.#updateRoomMetrics();

    this.#deviceName.value = "";
    this.#updateSaveButtonState();
  }

  #getRoomContainer(room) {
    const section = document.querySelector(`.${room}-devices`);
    return section?.querySelector(".devices-container") ?? null;
  }

  #renderDevice(name, type, room, uuid, isOn = true) {
    const roomContainer = this.#getRoomContainer(room);
    if (!roomContainer) return;

    const device = document.createElement("div");
    device.classList.add("card", "g-col-4");
    device.dataset.uuid = uuid;

    device.innerHTML = `
      <div class="card-body ${isOn ? "" : "opacity-50"}">
        <div class="card-header">
          <img src="img/${type}.svg" alt="${type}">
          <div class="card-title__container">
            <h5 class="card-title col fs-6">${name}</h5>
            <span class="list-group-item">Type: ${type}</span>
          </div>
      </div>
      <ul class="${type === "light" ? "light-settings" : ""}">
      ${type === "light" ? `<li class="form-range__container"><input type="range" min="0" max="100" value="0" class="form-range" id="brightness-${uuid}"></li>` : ""}
        <li class="list-group-item">
          <div class="form-check form-switch cntr">
            <input class="form-check-input toggle-switch hidden-xs-up" id="cbx-${uuid}" type="checkbox" role="switch" ${isOn ? "checked" : ""}>
            <label class="form-check-label toggle-label cbx" for="cbx-${uuid}"></label>
            <span class="toggle-text ${type === "light" ? "hidden" : ""}">${isOn ? "Active" : "Inactive"}</span>
          </div>
        </li>
      </ul>
      ${
        type !== "floor-heating"
          ? `<div class="delete-btn-container">
               <button class="btn btn-danger remove-btn"><i class="fa-solid fa-trash-can" style="color: rgb(231, 237, 248);"></i></button>
             </div>`
          : ""
      }

      </div>
      
    `;

    const toggle = device.querySelector(".toggle-switch");
    const label = device.querySelector(".toggle-text");
    const brightnessControl = device.querySelector(`#brightness-${uuid}`);

    if (brightnessControl) {
      brightnessControl.addEventListener("input", (e) => {
        const brightness = e.target.value;
        const homeDevice = this.#home.devices.find((d) => d.uuid === uuid); // ← перейменуй

        if (brightness === "0") {
          toggle.checked = false;
          this.#toggleDeviceState(uuid, false);
          device.querySelector(".card-body").classList.add("opacity-50");
        } else {
          toggle.checked = true;
          this.#toggleDeviceState(uuid, true);
          device.querySelector(".card-body").classList.remove("opacity-50");
        }

        if (homeDevice) homeDevice.brightness = brightness; // ← використай перейменовану
      });
    }

    toggle.addEventListener("change", (e) => {
      const isOn = e.target.checked;

      label.textContent = e.target.checked ? "Active" : "Inactive";

      device.querySelector(".card-body").classList.toggle("opacity-50", !isOn);
      if (type === "light" && brightnessControl) {
        brightnessControl.value = isOn ? "100" : "0";
      }
      this.#toggleDeviceState(uuid, isOn);
      this.#updateRoomMetrics();
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
    this.#updateRoomMetrics();
  }
}

new SmartHomeUI();
