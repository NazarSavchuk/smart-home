/**
 * @param {object} params
 * @param {import("../core/SmartHome.js").SmartHome} params.home
 * @param {HTMLElement} params.roomContainer
 * @param {() => void} params.persist
 * @param {() => void} params.updateMetrics
 * @param {(uuid: string, type: string) => void} params.openSettings
 * @param {(uuid: string, isOn: boolean) => void} params.syncDevicePower
 * @param {(uuid: string, el: HTMLElement) => void} params.removeDevice
 */
export function mountDeviceCard({
  home,
  roomContainer,
  persist,
  updateMetrics,
  openSettings,
  syncDevicePower,
  removeDevice,
  name,
  type,
  room,
  uuid,
  isOn = false,
  brightness = 0,
  color = "#ffffff",
  mode = "normal",
}) {
  if (!roomContainer) return;

  const device = document.createElement("div");
  device.classList.add("card", "g-col-4");
  device.dataset.uuid = uuid;

  const hasSettings = ["tv", "blinds", "camera", "light"].includes(type);

  device.innerHTML = `
      <div class="card-body ${isOn ? "" : "opacity-50"}">
        <div class="card-header">
          ${type !== "floor-heating" ? `
            <div class="delete-btn-container">
              <button class="btn btn-danger remove-btn" title="Remove">
                <i class="fa-solid fa-trash-can" style="color: rgb(231, 237, 248);"></i>
              </button>
            </div>` : ""}
          <img src="img/${type}.svg" alt="${type}">
          <div class="card-title__container">
            <h5 class="card-title col fs-6">${name}</h5>
            <span class="list-group-item">Type: ${type}</span>
          </div>
        </div>

        ${type === "light" ? `
          <li class="form-range__container">
            <input type="range" min="0" max="100" value="${brightness}" class="form-range" id="brightness-${uuid}">
          </li>` : ""}

        ${type === "blinds" ? `
          <li class="form-range__container blinds-range-wrap">
            <label class="range-label">Open: <span class="blinds-pct">${brightness || 0}%</span></label>
            <input type="range" min="0" max="100" value="${brightness || 0}" class="form-range blinds-range" id="blinds-pos-${uuid}">
          </li>` : ""}

        ${type === "light" ? `
          <li class="list-group-item light-controls-row">
            <div class="form-check form-switch cntr">
              <input class="form-check-input toggle-switch hidden-xs-up" id="cbx-${uuid}" type="checkbox" role="switch" ${isOn ? "checked" : ""}>
              <label class="form-check-label toggle-label cbx" for="cbx-${uuid}"></label>
              <span class="toggle-text hidden">${isOn ? "Active" : "Inactive"}</span>
            </div>
            <button class="btn btn-settings open-settings-btn light-settings-btn-inline" data-uuid="${uuid}" data-type="light">
              <i class="fa-solid fa-sliders"></i> Light Settings
            </button>
          </li>` : `
          <li class="list-group-item">
            <div class="form-check form-switch cntr">
              <input class="form-check-input toggle-switch hidden-xs-up" id="cbx-${uuid}" type="checkbox" role="switch" ${isOn ? "checked" : ""}>
              <label class="form-check-label toggle-label cbx" for="cbx-${uuid}"></label>
              <span class="toggle-text">${isOn ? "Active" : "Inactive"}</span>
            </div>
          </li>
        `}

        ${hasSettings && type !== "light" ? `
          <li class="list-group-item settings-btn-item">
            <button class="btn btn-settings open-settings-btn" data-uuid="${uuid}" data-type="${type}">
              <i class="fa-solid fa-sliders"></i> Settings
            </button>
          </li>` : ""}
      </div>
    `;

  const toggle = device.querySelector(".toggle-switch");
  const label = device.querySelector(".toggle-text");
  const brightnessControl = device.querySelector(`#brightness-${uuid}`);
  const blindsControl = device.querySelector(`#blinds-pos-${uuid}`);

  if (brightnessControl) {
    brightnessControl.addEventListener("input", (e) => {
      const val = e.target.value;
      const dev = home.getDeviceByUuid(uuid);
      if (dev) dev.brightness = val;
      toggle.checked = val > 0;
      syncDevicePower(uuid, val > 0);
      device.querySelector(".card-body").classList.toggle("opacity-50", val == 0);
    });
  }

  if (blindsControl) {
    blindsControl.addEventListener("input", (e) => {
      const val = e.target.value;
      device.querySelector(".blinds-pct").textContent = `${val}%`;
      const dev = home.getDeviceByUuid(uuid);
      if (dev && dev.setPosition) dev.setPosition(val);
      toggle.checked = val > 0;
      syncDevicePower(uuid, val > 0);
      device.querySelector(".card-body").classList.toggle("opacity-50", val == 0);
    });
  }

  toggle.addEventListener("change", (e) => {
    const on = e.target.checked;
    if (label) label.textContent = on ? "Active" : "Inactive";
    device.querySelector(".card-body").classList.toggle("opacity-50", !on);
    if (type === "light" && brightnessControl) brightnessControl.value = on ? "100" : "0";
    if (type === "blinds" && blindsControl) {
      blindsControl.value = on ? "100" : "0";
      device.querySelector(".blinds-pct").textContent = on ? "100%" : "0%";
    }
    const dev = home.getDeviceByUuid(uuid);
    if (dev) dev.isOn = on;
    syncDevicePower(uuid, on);
    updateMetrics();
  });

  device.querySelector(".open-settings-btn")?.addEventListener("click", () => {
    openSettings(uuid, type);
  });

  if (type !== "floor-heating") {
    device.querySelector(".remove-btn")?.addEventListener("click", () => removeDevice(uuid, device));
  }

  roomContainer.appendChild(device);
}
