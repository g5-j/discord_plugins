var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
  playSound: () => playSound
});
module.exports = __toCommonJS(index_exports);
var import_metro = require("@vendetta/metro");
var import_common2 = require("@vendetta/metro/common");
var import_plugin2 = require("@vendetta/plugin");
var import_vendetta = require("@vendetta");

// QuickSoundboard/src/Settings.tsx
var import_common = require("@vendetta/metro/common");
var import_components = require("@vendetta/ui/components");
var import_storage = require("@vendetta/storage");
var import_plugin = require("@vendetta/plugin");
var { ScrollView, View } = import_common.ReactNative;
var { FormSection, FormInput, FormSwitchRow, FormButton, FormText } = import_components.Forms;
var typedStorage = import_plugin.storage;
function Settings() {
  (0, import_storage.useProxy)(typedStorage);
  typedStorage.enabled ??= true;
  typedStorage.favorites ??= [];
  const [soundIdInput, setSoundIdInput] = import_common.React.useState("");
  const handleAddSound = () => {
    if (!soundIdInput.trim()) return;
    typedStorage.favorites.push({
      soundId: soundIdInput.trim(),
      name: `Sound #${soundIdInput.trim().slice(-4)}`
    });
    setSoundIdInput("");
  };
  return /* @__PURE__ */ import_common.React.createElement(ScrollView, { style: { paddingBottom: 24 } }, /* @__PURE__ */ import_common.React.createElement(View, { style: { padding: 16 } }, /* @__PURE__ */ import_common.React.createElement(FormSection, { title: "General Settings" }, /* @__PURE__ */ import_common.React.createElement(
    FormSwitchRow,
    {
      label: "Enable Soundboard",
      subLabel: "Master switch for quick soundboard functionality",
      value: typedStorage.enabled,
      onValueChange: (v) => {
        typedStorage.enabled = v;
      }
    }
  )), /* @__PURE__ */ import_common.React.createElement(FormSection, { title: "Add Favorite Sound" }, /* @__PURE__ */ import_common.React.createElement(
    FormInput,
    {
      title: "Sound ID",
      placeholder: "Paste Discord Sound ID here",
      value: soundIdInput,
      onChange: (v) => setSoundIdInput(v),
      keyboardType: "numeric"
    }
  ), /* @__PURE__ */ import_common.React.createElement(
    FormButton,
    {
      text: "Add to Favorites",
      onPress: handleAddSound
    }
  )), /* @__PURE__ */ import_common.React.createElement(FormSection, { title: `Favorite Sounds (${typedStorage.favorites.length})` }, typedStorage.favorites.length === 0 ? /* @__PURE__ */ import_common.React.createElement(FormText, { style: { padding: 8 } }, "No favorite sounds added yet.") : typedStorage.favorites.map((sound, index) => /* @__PURE__ */ import_common.React.createElement(View, { key: index, style: { marginBottom: 10, flexDirection: "row", alignItems: "center" } }, /* @__PURE__ */ import_common.React.createElement(
    FormButton,
    {
      text: `\u25B6 Play ${sound.name}`,
      onPress: () => playSound(sound)
    }
  ))))));
}

// QuickSoundboard/src/index.ts
var typedStorage2 = import_plugin2.storage;
function playSound(sound) {
  try {
    const VoiceStateStore = (0, import_metro.findByProps)("getVoiceChannelId");
    const ChannelStore = (0, import_metro.findByProps)("getChannel");
    const currentChannelId = VoiceStateStore?.getVoiceChannelId();
    if (!currentChannelId) {
      import_vendetta.logger.warn("[Quick Soundboard] You must be in a voice channel!");
      return false;
    }
    const channel = ChannelStore?.getChannel(currentChannelId);
    const guildId = channel?.guild_id ?? sound.guildId ?? "0";
    import_common2.FluxDispatcher.dispatch({
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
  typedStorage2.enabled ??= true;
  typedStorage2.favorites ??= [];
}
function onUnload() {
  import_vendetta.logger.log("[Quick Soundboard] Plugin Unloaded.");
}
module.exports = {
  onLoad,
  onUnload,
  playSound,
  settings: Settings
};
