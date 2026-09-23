var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// QuickSoundboard/src/index.tsx
var index_exports = {};
module.exports = __toCommonJS(index_exports);
var import_metro = require("@vendetta/metro");
var import_common = require("@vendetta/metro/common");
var import_plugin = require("@vendetta/plugin");
var import_vendetta = require("@vendetta");
var import_toasts = require("@vendetta/ui/toasts");
function safeFindByProps(...props) {
  try {
    return (0, import_metro.findByProps)(...props);
  } catch (e) {
    import_vendetta.logger.error(`[Quick Soundboard] Failed to find props: ${props.join(", ")}`, e);
    return null;
  }
}
function getCurrentVoiceChannelId() {
  var _a;
  try {
    const VoiceStateStore = safeFindByProps("getVoiceChannelId");
    return (_a = VoiceStateStore == null ? void 0 : VoiceStateStore.getVoiceChannelId()) != null ? _a : null;
  } catch (e) {
    import_vendetta.logger.error("[Quick Soundboard] Error fetching voice channel:", e);
    return null;
  }
}
function playSound(sound) {
  var _a, _b, _c;
  try {
    const currentChannelId = getCurrentVoiceChannelId();
    if (!currentChannelId) {
      (0, import_toasts.showToast)("You must be in a voice channel!", (_a = safeFindByProps("getAssetIDByName")) == null ? void 0 : _a("Small"));
      return false;
    }
    const ChannelStore = safeFindByProps("getChannel");
    const channel = ChannelStore == null ? void 0 : ChannelStore.getChannel(currentChannelId);
    const guildId = (_c = (_b = channel == null ? void 0 : channel.guild_id) != null ? _b : sound.guildId) != null ? _c : "0";
    import_common.FluxDispatcher.dispatch({
      type: "GUILD_SOUNDBOARD_SOUND_PLAY_START",
      soundId: sound.soundId,
      channelId: currentChannelId,
      guildId
    });
    return true;
  } catch (e) {
    import_vendetta.logger.error("[Quick Soundboard] Failed to play sound:", e);
    return false;
  }
}
function onLoad() {
  var _a, _b, _c;
  try {
    import_vendetta.logger.log("[Quick Soundboard] Plugin Loaded Successfully!");
    (0, import_toasts.showToast)("Quick Soundboard Activated!", (_a = safeFindByProps("getAssetIDByName")) == null ? void 0 : _a("Check"));
    if (import_plugin.storage) {
      const typedStorage = import_plugin.storage;
      (_b = typedStorage.enabled) != null ? _b : typedStorage.enabled = true;
      (_c = typedStorage.favorites) != null ? _c : typedStorage.favorites = [];
    }
  } catch (err) {
    import_vendetta.logger.error("[Quick Soundboard] Error in onLoad:", err);
  }
}
function onUnload() {
  var _a;
  try {
    import_vendetta.logger.log("[Quick Soundboard] Plugin Unloaded!");
    (0, import_toasts.showToast)("Quick Soundboard Disabled!", (_a = safeFindByProps("getAssetIDByName")) == null ? void 0 : _a("Small"));
  } catch (err) {
    import_vendetta.logger.error("[Quick Soundboard] Error in onUnload:", err);
  }
}
module.exports = {
  onLoad,
  onUnload,
  playSound
};
