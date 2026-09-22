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
    default: () => index_default
  });
  var import_plugin2 = __require("@vendetta/plugin");
  var import_vendetta = __require("@vendetta");

  // QuickSoundboard/src/Settings.tsx
  var import_common = __require("@vendetta/metro/common");
  var import_components = __require("@vendetta/ui/components");
  var import_storage = __require("@vendetta/storage");
  var import_plugin = __require("@vendetta/plugin");
  var { ScrollView, View } = import_common.ReactNative;
  var { FormSection, FormInput, FormSwitchRow, FormText } = import_components.Forms;
  var typedStorage = import_plugin.storage;
  function Settings() {
    (0, import_storage.useProxy)(typedStorage);
    typedStorage.enabled ??= true;
    typedStorage.favorites ??= [];
    return /* @__PURE__ */ import_common.React.createElement(ScrollView, { style: { paddingBottom: 24 } }, /* @__PURE__ */ import_common.React.createElement(View, { style: { padding: 16 } }, /* @__PURE__ */ import_common.React.createElement(FormSection, { title: "Quick Soundboard Settings" }, /* @__PURE__ */ import_common.React.createElement(
      FormSwitchRow,
      {
        label: "Enable Overlay Hotkeys",
        subLabel: "Show quick sound options when connected to voice",
        value: typedStorage.enabled,
        onValueChange: (v) => {
          typedStorage.enabled = v;
        }
      }
    )), /* @__PURE__ */ import_common.React.createElement(FormSection, { title: "Favorite Sounds (Configured: {typedStorage.favorites.length})" }, /* @__PURE__ */ import_common.React.createElement(FormText, { style: { marginBottom: 12 } }, "Add Sound IDs below to quickly trigger them in voice channels."), /* @__PURE__ */ import_common.React.createElement(
      FormInput,
      {
        title: "Add Sound ID",
        placeholder: "e.g. 1054951789318909972",
        keyboardType: "numeric",
        onSubmitEditing: (e) => {
          const text = e.nativeEvent.text;
          if (text) {
            typedStorage.favorites.push({
              soundId: text,
              name: `Sound #${text.slice(-4)}`
            });
          }
        }
      }
    ))));
  }

  // QuickSoundboard/src/utils.ts
  var import_metro = __require("@vendetta/metro");
  var import_common2 = __require("@vendetta/metro/common");
  var SoundboardStore = (0, import_metro.findByProps)("getSounds", "getSoundById");
  var VoiceStateStore = (0, import_metro.findByProps)("getVoiceChannelId");
  var ChannelStore = (0, import_metro.findByProps)("getChannel");
  function playSound(sound) {
    const currentChannelId = VoiceStateStore.getVoiceChannelId();
    if (!currentChannelId) return false;
    const channel = ChannelStore.getChannel(currentChannelId);
    const guildId = channel?.guild_id ?? sound.guildId ?? "0";
    import_common2.FluxDispatcher.dispatch({
      type: "GUILD_SOUNDBOARD_SOUND_PLAY_START",
      soundId: sound.soundId,
      channelId: currentChannelId,
      guildId
    });
    return true;
  }

  // QuickSoundboard/src/index.ts
  var typedStorage2 = import_plugin2.storage;
  var index_default = {
    onLoad() {
      import_vendetta.logger.log("[Quick Soundboard] Plugin Loaded Successfully.");
      typedStorage2.enabled ??= true;
      typedStorage2.favorites ??= [];
    },
    onUnload() {
      import_vendetta.logger.log("[Quick Soundboard] Plugin Unloaded.");
    },
    // دالة برمجية لاستدعاء الصوت الأول المفضل
    triggerQuickSound(index = 0) {
      if (!typedStorage2.enabled) return;
      const currentChannel = VoiceStateStore.getVoiceChannelId();
      if (!currentChannel) {
        import_vendetta.logger.warn("[Quick Soundboard] Not connected to any voice channel.");
        return;
      }
      const sound = typedStorage2.favorites[index];
      if (sound) {
        const success = playSound(sound);
        if (success) {
          import_vendetta.logger.log(`[Quick Soundboard] Playing sound: ${sound.name}`);
        }
      } else {
        import_vendetta.logger.warn("[Quick Soundboard] No favorite sound configured at index: " + index);
      }
    },
    settings: Settings
  };
  return __toCommonJS(index_exports);
})();
