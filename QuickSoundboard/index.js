var QuickSoundboard = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // QuickSoundboard/src/index.ts
  var require_index = __commonJS({
    "QuickSoundboard/src/index.ts"(exports, module) {
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
      function onLoad() {
        import_vendetta.logger.log("[Quick Soundboard] Plugin Loaded Successfully.");
        typedStorage.enabled ??= true;
        typedStorage.favorites ??= [];
      }
      function onUnload() {
        import_vendetta.logger.log("[Quick Soundboard] Plugin Unloaded.");
      }
      module.exports = {
        onLoad,
        onUnload,
        playSound
      };
    }
  });
  return require_index();
})();
