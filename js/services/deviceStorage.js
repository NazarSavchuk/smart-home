import { Light } from "../models/Light.js";
import { TV } from "../models/TV.js";
import { Blinds } from "../models/Blinds.js";
import { Camera } from "../models/Camera.js";

export const DEVICE_STORAGE_KEY = "dreamhouse_devices_v1";

/**
 * @param {unknown[]} devices
 */
export function saveDevicesToStorage(devices) {
  try {
    const serialized = devices.map((device) => {
      const base = {
        name: device.name,
        type: device.type,
        isOn: !!device.isOn,
        uuid: device.uuid,
        room: device.room,
      };

      if (device.type === "light" && device.getInfo) {
        const info = device.getInfo();
        return { ...base, brightness: info.brightness, color: info.color, mode: info.mode };
      }
      if (device.type === "tv" && device.getInfo) {
        const info = device.getInfo();
        return {
          ...base,
          volume: info.volume,
          isMuted: info.isMuted,
          currentChannelNumber: info.currentChannel?.number ?? 1,
          input: info.input,
          channels: device.channels ?? [],
        };
      }
      if (device.type === "blinds" && device.getInfo) {
        const info = device.getInfo();
        return { ...base, position: info.position, tiltAngle: info.tiltAngle };
      }
      if (device.type === "camera" && device.getInfo) {
        const info = device.getInfo();
        return {
          ...base,
          mode: info.mode,
          resolution: info.resolution,
          nightVision: info.nightVision,
        };
      }
      return base;
    });

    localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(serialized));
  } catch (_) {}
}

/**
 * @returns {unknown[] | null}
 */
export function readStoredDeviceSnapshots() {
  try {
    const raw = localStorage.getItem(DEVICE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (_) {
    return null;
  }
}

/**
 * @param {unknown} snapshot
 */
export function restoreDeviceFromSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return null;

  const { name, type, isOn, uuid, room } = snapshot;
  if (!name || !type || !uuid || !room) return null;

  let restored;

  if (type === "light") {
    restored = new Light(name, !!isOn);
    if (typeof snapshot.mode === "string") {
      try {
        restored.setMode(snapshot.mode);
      } catch (_) {}
    }
    if (typeof snapshot.brightness !== "undefined") {
      try {
        restored.brightness = Number(snapshot.brightness);
      } catch (_) {}
    }
    if (typeof snapshot.color === "string") {
      try {
        restored.setColor(snapshot.color);
      } catch (_) {}
    }
  } else if (type === "tv") {
    restored = new TV(name, !!isOn);
    if (Array.isArray(snapshot.channels)) {
      const existing = restored.channels.map((channel) => channel.number);
      existing.forEach((number) => {
        try {
          restored.removeChannel(number);
        } catch (_) {}
      });
      snapshot.channels.forEach((channel) => {
        if (!channel || typeof channel.number !== "number" || typeof channel.name !== "string") return;
        try {
          restored.addChannel(channel.number, channel.name);
        } catch (_) {}
      });
    }
    if (typeof snapshot.input === "string") {
      try {
        restored.setInput(snapshot.input);
      } catch (_) {}
    }
    if (typeof snapshot.volume !== "undefined") {
      try {
        restored.setVolume(Number(snapshot.volume));
      } catch (_) {}
    }
    const muteShouldBe = !!snapshot.isMuted;
    if (restored.isMuted !== muteShouldBe) restored.toggleMute();
    if (typeof snapshot.currentChannelNumber === "number") {
      try {
        restored.goToChannel(snapshot.currentChannelNumber);
      } catch (_) {}
    }
  } else if (type === "blinds") {
    restored = new Blinds(name, !!isOn);
    if (typeof snapshot.position !== "undefined") {
      try {
        restored.setPosition(Number(snapshot.position));
      } catch (_) {}
    }
    if (typeof snapshot.tiltAngle !== "undefined") {
      try {
        restored.setTilt(Number(snapshot.tiltAngle));
      } catch (_) {}
    }
  } else if (type === "camera") {
    restored = new Camera(name, !!isOn);
    if (typeof snapshot.mode === "string") {
      try {
        restored.setMode(snapshot.mode);
      } catch (_) {}
    }
    if (typeof snapshot.resolution === "string") {
      try {
        restored.setResolution(snapshot.resolution);
      } catch (_) {}
    }
    if (typeof snapshot.nightVision !== "undefined" && restored.nightVision !== !!snapshot.nightVision) {
      restored.toggleNightVision();
    }
  } else {
    restored = { name, type, isOn: !!isOn, uuid, room };
  }

  restored.uuid = uuid;
  restored.room = room;
  restored.isOn = !!isOn;
  return restored;
}

/** @param {{ devices: unknown[] }} home */
export function loadDevicesIntoHome(home) {
  const snapshots = readStoredDeviceSnapshots();
  if (!snapshots) return;

  const restored = snapshots.map((s) => restoreDeviceFromSnapshot(s)).filter(Boolean);
  if (restored.length > 0) home.devices = restored;
}
