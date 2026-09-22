var QuickSoundboard = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // QuickSoundboard/src/index.ts
  var index_exports = {};
  __export(index_exports, {
    default: () => index_default,
    playSound: () => playSound
  });
  var import_metro = __require("@vendetta/metro");
  var import_common = __require("@vendetta/metro/common");
  var import_plugin = __require("@vendetta/plugin");
  var import_vendetta = __require("@vendetta");
  var typedStorage = import_plugin.storage;
  function playSound(sound) {
    try {
      const VoiceStateStore = (0, import_metro.findByProps)("getVoiceChannelId");
      const ChannelStore = (0, import_metro.findByProps)("getChannel");
      const currentChannelId = VoiceStateStore?.getVoiceChannelId();
      if (!currentChannelId) return false;
      const channel = ChannelStore?.getChannel(currentChannelId);
      const guildId = channel?.guild_id ?? sound.guildId ?? "0";
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
  var index_default = {
    onLoad() {
      import_vendetta.logger.log("[Quick Soundboard] Plugin Loaded Successfully.");
      typedStorage.enabled ??= true;
      typedStorage.favorites ??= [];
    },
    onUnload() {
      import_vendetta.logger.log("[Quick Soundboard] Plugin Unloaded.");
    }
  };
  return __toCommonJS(index_exports);
})();
