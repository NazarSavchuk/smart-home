/**
 * @typedef {object} SettingsModalCallbacks
 * @property {() => void} persist
 * @property {() => void} updateMetrics
 * @property {(uuid: string, isOn: boolean) => void} syncDevicePower
 */

/** @param {import("../models/TV.js").TV} tv */
export function buildTVPanel(tv) {
  const info = tv.getInfo ? tv.getInfo() : {};
  const channels = tv.channels ?? [];
  return `
      <div class="settings-panel tv-panel">
        <div class="settings-row">
          <span class="settings-label"><i class="fa-solid fa-tv"></i> Status</span>
          <span class="badge ${tv.isOn ? "badge-on" : "badge-off"}">${tv.isOn ? "ON" : "OFF"}</span>
        </div>

        <div class="settings-row">
          <span class="settings-label"><i class="fa-solid fa-satellite-dish"></i> Input</span>
          <select class="settings-select" id="tv-input-select">
            ${["HDMI 1", "HDMI 2", "USB", "TV Antenna"]
              .map((i) => `<option value="${i}" ${info.input === i ? "selected" : ""}>${i}</option>`)
              .join("")}
          </select>
        </div>

        <div class="settings-row">
          <span class="settings-label"><i class="fa-solid fa-volume-high"></i> Volume</span>
          <div class="range-with-val">
            <input type="range" min="0" max="100" value="${info.volume ?? 30}" id="tv-volume" class="form-range">
            <span class="range-val" id="tv-vol-val">${info.volume ?? 30}</span>
          </div>
        </div>

        <div class="settings-row">
          <span class="settings-label"><i class="fa-solid fa-volume-xmark"></i> Mute</span>
          <label class="toggle-pill">
            <input type="checkbox" id="tv-mute" ${info.isMuted ? "checked" : ""}>
            <span class="pill-slider"></span>
          </label>
        </div>

        <div class="settings-section-title">Channels</div>
        <div class="channel-controls">
          <button class="btn-ch" id="tv-prev-ch"><i class="fa-solid fa-chevron-up"></i></button>
          <div class="current-channel" id="tv-current-ch">
            <span class="ch-number">CH ${info.currentChannel?.number ?? 1}</span>
            <span class="ch-name">${info.currentChannel?.name ?? ""}</span>
          </div>
          <button class="btn-ch" id="tv-next-ch"><i class="fa-solid fa-chevron-down"></i></button>
        </div>

        <div class="settings-row">
          <input type="text" class="settings-input" id="tv-search" placeholder="Search channel...">
          <button class="btn-action" id="tv-search-btn"><i class="fa-solid fa-magnifying-glass"></i></button>
        </div>
        <ul class="channel-list" id="tv-channel-list">
          ${channels
            .map(
              (c) =>
                `<li class="ch-item ${c.number === info.currentChannel?.number ? "active-ch" : ""}" data-ch="${c.number}"><span class="ch-num">${c.number}</span>${c.name}</li>`
            )
            .join("")}
        </ul>

        <div class="settings-section-title">Add Channel</div>
        <div class="settings-row">
          <input type="number" class="settings-input" id="tv-new-ch-num" placeholder="Number" min="1" style="width:80px">
          <input type="text" class="settings-input" id="tv-new-ch-name" placeholder="Channel name">
          <button class="btn-action" id="tv-add-ch-btn"><i class="fa-solid fa-plus"></i></button>
        </div>
        <div class="settings-message" id="tv-message"></div>
      </div>
    `;
}

/** @param {import("../models/Blinds.js").Blinds} blinds */
export function buildBlindsPanel(blinds) {
  const info = blinds.getInfo ? blinds.getInfo() : {};
  return `
      <div class="settings-panel blinds-panel">
        <div class="settings-row">
          <span class="settings-label"><i class="fa-solid fa-blinds"></i> Position</span>
          <div class="range-with-val">
            <input type="range" min="0" max="100" value="${info.position ?? 0}" id="blinds-pos-modal" class="form-range">
            <span class="range-val" id="blinds-pos-val">${info.position ?? 0}%</span>
          </div>
        </div>
        <div class="blinds-presets">
          <button class="preset-btn" id="blinds-open">Open 100%</button>
          <button class="preset-btn" id="blinds-half">Half 50%</button>
          <button class="preset-btn" id="blinds-close">Close 0%</button>
        </div>
        <div class="settings-row">
          <span class="settings-label"><i class="fa-solid fa-rotate"></i> Tilt Angle</span>
          <div class="range-with-val">
            <input type="range" min="0" max="90" value="${info.tiltAngle ?? 0}" id="blinds-tilt" class="form-range">
            <span class="range-val" id="blinds-tilt-val">${info.tiltAngle ?? 0}°</span>
          </div>
        </div>
      </div>
    `;
}

/** @param {import("../models/Camera.js").Camera} camera */
export function buildCameraPanel(camera) {
  const info = camera.getInfo ? camera.getInfo() : {};
  return `
      <div class="settings-panel camera-panel">
        <div class="settings-row">
          <span class="settings-label"><i class="fa-solid fa-video"></i> Mode</span>
          <select class="settings-select" id="camera-mode-select">
            ${["idle", "monitoring", "recording", "motion-detect"]
              .map((m) => `<option value="${m}" ${info.mode === m ? "selected" : ""}>${m}</option>`)
              .join("")}
          </select>
        </div>
        <div class="settings-row">
          <span class="settings-label"><i class="fa-solid fa-expand"></i> Resolution</span>
          <select class="settings-select" id="camera-res-select">
            ${["720p", "1080p", "4K"]
              .map((r) => `<option value="${r}" ${info.resolution === r ? "selected" : ""}>${r}</option>`)
              .join("")}
          </select>
        </div>
        <div class="settings-row">
          <span class="settings-label"><i class="fa-solid fa-moon"></i> Night Vision</span>
          <label class="toggle-pill">
            <input type="checkbox" id="camera-night" ${info.nightVision ? "checked" : ""}>
            <span class="pill-slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <span class="settings-label"><i class="fa-solid fa-circle-dot recording-dot ${info.isRecording ? "rec-active" : ""}"></i> Recording</span>
          <span class="badge ${info.isRecording ? "badge-on" : "badge-off"}" id="camera-rec-badge">${info.isRecording ? "REC" : "OFF"}</span>
        </div>
        <div class="settings-row">
          <span class="settings-label"><i class="fa-solid fa-person-running"></i> Motion</span>
          <span class="badge ${info.motionDetected ? "badge-motion" : "badge-off"}" id="camera-motion-badge">${info.motionDetected ? "DETECTED" : "Clear"}</span>
        </div>
        <button class="btn-action full-width-btn" id="camera-trigger-motion">
          <i class="fa-solid fa-bolt"></i> Simulate Motion
        </button>
      </div>
    `;
}

/** @param {import("../models/Light.js").Light} light */
export function buildLightPanel(light) {
  const info = light.getInfo ? light.getInfo() : {};
  return `
      <div class="settings-panel light-panel">
        <div class="settings-row">
          <span class="settings-label"><i class="fa-solid fa-sun"></i> Brightness</span>
          <div class="range-with-val">
            <input type="range" min="0" max="100" value="${info.brightness ?? 80}" id="light-brightness-modal" class="form-range">
            <span class="range-val" id="light-br-val">${info.brightness ?? 80}%</span>
          </div>
        </div>
        <div class="settings-row">
          <span class="settings-label"><i class="fa-solid fa-palette"></i> Color</span>
          <input type="color" id="light-color-pick" value="${info.color ?? "#ffffff"}" class="color-picker">
        </div>
        <div class="settings-row">
          <span class="settings-label"><i class="fa-solid fa-wand-magic-sparkles"></i> Mode</span>
          <div class="mode-btns">
            ${["normal", "night", "party"]
              .map(
                (m) =>
                  `<button class="mode-btn ${info.mode === m ? "active-mode" : ""}" data-mode="${m}">${m}</button>`
              )
              .join("")}
          </div>
        </div>
        <div class="light-preview" id="light-preview" style="background:${info.color ?? "#ffffff"};opacity:${(info.brightness ?? 80) / 100}"></div>
      </div>
    `;
}

/**
 * @param {string} type
 * @param {object} device
 */
export function buildSettingsPanelHtml(type, device) {
  if (type === "tv") return buildTVPanel(device);
  if (type === "blinds") return buildBlindsPanel(device);
  if (type === "camera") return buildCameraPanel(device);
  if (type === "light") return buildLightPanel(device);
  return "";
}

/**
 * @param {string} uuid
 * @param {string} type
 * @param {object} device
 * @param {SettingsModalCallbacks} cb
 */
export function bindSettingsPanelEvents(uuid, type, device, cb) {
  if (type === "tv") bindTVEvents(uuid, device, cb);
  else if (type === "blinds") bindBlindsEvents(uuid, device, cb);
  else if (type === "camera") bindCameraEvents(uuid, device, cb);
  else if (type === "light") bindLightModalEvents(uuid, device, cb);
}

/**
 * @param {string} uuid
 * @param {import("../models/TV.js").TV} tv
 * @param {SettingsModalCallbacks} cb
 */
function bindTVEvents(uuid, tv, cb) {
  const volSlider = document.getElementById("tv-volume");
  const volVal = document.getElementById("tv-vol-val");
  const muteToggle = document.getElementById("tv-mute");
  const inputSelect = document.getElementById("tv-input-select");
  const prevBtn = document.getElementById("tv-prev-ch");
  const nextBtn = document.getElementById("tv-next-ch");
  const currentChEl = document.getElementById("tv-current-ch");
  const searchInput = document.getElementById("tv-search");
  const searchBtn = document.getElementById("tv-search-btn");
  const channelList = document.getElementById("tv-channel-list");
  const msg = document.getElementById("tv-message");
  const addChBtn = document.getElementById("tv-add-ch-btn");

  const refreshChannelList = (channels) => {
    const info = tv.getInfo();
    channelList.innerHTML = (channels ?? tv.channels)
      .map(
        (c) =>
          `<li class="ch-item ${c.number === info.currentChannel?.number ? "active-ch" : ""}" data-ch="${c.number}">
          <span class="ch-num">${c.number}</span>${c.name}
        </li>`
      )
      .join("");
    channelList.querySelectorAll(".ch-item").forEach((li) => {
      li.addEventListener("click", () => {
        tv.goToChannel(Number(li.dataset.ch));
        updateCurrentCh();
        refreshChannelList();
        cb.persist();
      });
    });
  };

  const updateCurrentCh = () => {
    const ch = tv.currentChannel;
    currentChEl.innerHTML = `<span class="ch-number">CH ${ch.number}</span><span class="ch-name">${ch.name}</span>`;
  };

  volSlider.addEventListener("input", () => {
    volVal.textContent = volSlider.value;
    tv.setVolume(Number(volSlider.value));
    muteToggle.checked = tv.isMuted;
    cb.persist();
  });

  muteToggle.addEventListener("change", () => {
    tv.toggleMute();
    cb.persist();
  });

  inputSelect.addEventListener("change", () => {
    tv.setInput(inputSelect.value);
    cb.persist();
  });

  prevBtn.addEventListener("click", () => {
    tv.prevChannel();
    updateCurrentCh();
    refreshChannelList();
    cb.persist();
  });
  nextBtn.addEventListener("click", () => {
    tv.nextChannel();
    updateCurrentCh();
    refreshChannelList();
    cb.persist();
  });

  searchBtn.addEventListener("click", () => {
    const q = searchInput.value.trim();
    if (!q) {
      refreshChannelList();
      return;
    }
    const results = tv.searchChannels(q);
    msg.textContent = results.length ? "" : "No channels found.";
    refreshChannelList(results);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchBtn.click();
    if (e.key === "Escape") {
      searchInput.value = "";
      refreshChannelList();
    }
  });

  addChBtn.addEventListener("click", () => {
    const num = Number(document.getElementById("tv-new-ch-num").value);
    const name = document.getElementById("tv-new-ch-name").value.trim();
    if (!num || !name) {
      msg.textContent = "Enter both number and name.";
      return;
    }
    try {
      tv.addChannel(num, name);
      msg.textContent = `Channel ${num} "${name}" added.`;
      document.getElementById("tv-new-ch-num").value = "";
      document.getElementById("tv-new-ch-name").value = "";
      refreshChannelList();
      cb.persist();
    } catch (e) {
      msg.textContent = e.message;
    }
  });

  refreshChannelList();
  cb.updateMetrics();
}

/**
 * @param {string} uuid
 * @param {import("../models/Blinds.js").Blinds} blinds
 * @param {SettingsModalCallbacks} cb
 */
function bindBlindsEvents(uuid, blinds, cb) {
  const posSlider = document.getElementById("blinds-pos-modal");
  const posVal = document.getElementById("blinds-pos-val");
  const tiltSlider = document.getElementById("blinds-tilt");
  const tiltVal = document.getElementById("blinds-tilt-val");

  const updateBlindsCard = (pos) => {
    const cardRange = document.querySelector(`#blinds-pos-${uuid}`);
    const cardPct = document.querySelector(`[data-uuid="${uuid}"] .blinds-pct`);
    if (cardRange) cardRange.value = pos;
    if (cardPct) cardPct.textContent = `${pos}%`;
    const toggle = document.querySelector(`#cbx-${uuid}`);
    if (toggle) toggle.checked = pos > 0;
    cb.syncDevicePower(uuid, pos > 0);
    const cardBody = document.querySelector(`[data-uuid="${uuid}"] .card-body`);
    if (cardBody) cardBody.classList.toggle("opacity-50", pos == 0);
  };

  posSlider.addEventListener("input", () => {
    const pos = Number(posSlider.value);
    posVal.textContent = `${pos}%`;
    blinds.setPosition(pos);
    updateBlindsCard(pos);
  });

  tiltSlider.addEventListener("input", () => {
    tiltVal.textContent = `${tiltSlider.value}°`;
    blinds.setTilt(Number(tiltSlider.value));
    cb.persist();
  });

  document.getElementById("blinds-open").addEventListener("click", () => {
    posSlider.value = 100;
    posVal.textContent = "100%";
    blinds.setPosition(100);
    updateBlindsCard(100);
  });
  document.getElementById("blinds-half").addEventListener("click", () => {
    posSlider.value = 50;
    posVal.textContent = "50%";
    blinds.setPosition(50);
    updateBlindsCard(50);
  });
  document.getElementById("blinds-close").addEventListener("click", () => {
    posSlider.value = 0;
    posVal.textContent = "0%";
    blinds.setPosition(0);
    updateBlindsCard(0);
  });

  cb.updateMetrics();
}

/**
 * @param {string} uuid
 * @param {import("../models/Camera.js").Camera} camera
 * @param {SettingsModalCallbacks} cb
 */
function bindCameraEvents(uuid, camera, cb) {
  const modeSelect = document.getElementById("camera-mode-select");
  const resSelect = document.getElementById("camera-res-select");
  const nightToggle = document.getElementById("camera-night");
  const recBadge = document.getElementById("camera-rec-badge");
  const motionBadge = document.getElementById("camera-motion-badge");
  const triggerBtn = document.getElementById("camera-trigger-motion");

  modeSelect.addEventListener("change", () => {
    camera.setMode(modeSelect.value);
    recBadge.textContent = camera.isRecording ? "REC" : "OFF";
    recBadge.className = `badge ${camera.isRecording ? "badge-on" : "badge-off"}`;
    const toggle = document.querySelector(`#cbx-${uuid}`);
    if (toggle) toggle.checked = camera.isOn;
    cb.syncDevicePower(uuid, camera.isOn);
    const cardBody = document.querySelector(`[data-uuid="${uuid}"] .card-body`);
    if (cardBody) cardBody.classList.toggle("opacity-50", !camera.isOn);
    cb.updateMetrics();
  });

  resSelect.addEventListener("change", () => {
    camera.setResolution(resSelect.value);
    cb.persist();
  });

  nightToggle.addEventListener("change", () => {
    camera.toggleNightVision();
    cb.persist();
  });

  triggerBtn.addEventListener("click", () => {
    camera.triggerMotion();
    motionBadge.textContent = "DETECTED";
    motionBadge.className = "badge badge-motion";
    recBadge.textContent = camera.isRecording ? "REC" : "OFF";
    recBadge.className = `badge ${camera.isRecording ? "badge-on" : "badge-off"}`;
    setTimeout(() => {
      motionBadge.textContent = "Clear";
      motionBadge.className = "badge badge-off";
      recBadge.textContent = camera.isRecording ? "REC" : "OFF";
      recBadge.className = `badge ${camera.isRecording ? "badge-on" : "badge-off"}`;
    }, 5000);
    cb.persist();
  });
}

/**
 * @param {string} uuid
 * @param {import("../models/Light.js").Light} light
 * @param {SettingsModalCallbacks} cb
 */
function bindLightModalEvents(uuid, light, cb) {
  const brSlider = document.getElementById("light-brightness-modal");
  const brVal = document.getElementById("light-br-val");
  const colorPick = document.getElementById("light-color-pick");
  const preview = document.getElementById("light-preview");
  const modeBtns = document.querySelectorAll(".mode-btn");
  const cardRange = document.querySelector(`#brightness-${uuid}`);

  const syncPreview = () => {
    preview.style.background = light.color;
    preview.style.opacity = light.brightness / 100;
  };

  brSlider.addEventListener("input", () => {
    brVal.textContent = `${brSlider.value}%`;
    light.brightness = brSlider.value;
    if (cardRange) cardRange.value = brSlider.value;
    const toggle = document.querySelector(`#cbx-${uuid}`);
    if (toggle) toggle.checked = light.isOn;
    cb.syncDevicePower(uuid, light.isOn);
    syncPreview();
  });

  colorPick.addEventListener("input", () => {
    try {
      light.setColor(colorPick.value);
      syncPreview();
      cb.persist();
    } catch (e) {}
  });

  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      light.setMode(btn.dataset.mode);
      brSlider.value = light.brightness;
      brVal.textContent = `${light.brightness}%`;
      colorPick.value = light.color;
      if (cardRange) cardRange.value = light.brightness;
      modeBtns.forEach((b) => b.classList.remove("active-mode"));
      btn.classList.add("active-mode");
      const toggle = document.querySelector(`#cbx-${uuid}`);
      if (toggle) toggle.checked = light.isOn;
      syncPreview();
      cb.persist();
    });
  });
}
