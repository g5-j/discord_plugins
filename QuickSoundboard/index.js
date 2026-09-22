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

// QuickSoundboard/src/index.tsx
var index_exports = {};
__export(index_exports, {
  getCurrentVoiceChannelId: () => getCurrentVoiceChannelId,
  playSound: () => playSound
});
module.exports = __toCommonJS(index_exports);
var import_metro = require("@vendetta/metro");
var import_common = require("@vendetta/metro/common");
var import_plugin = require("@vendetta/plugin");
var import_vendetta = require("@vendetta");
var typedStorage = import_plugin.storage;
function getCurrentVoiceChannelId() {
  var _a;
  try {
    const VoiceStateStore = (0, import_metro.findByProps)("getVoiceChannelId");
    return (_a = VoiceStateStore == null ? void 0 : VoiceStateStore.getVoiceChannelId()) != null ? _a : null;
  } catch (e) {
    import_vendetta.logger.error("[Quick Soundboard] Error fetching voice channel:", e);
    return null;
  }
}
function playSound(sound) {
  var _a, _b;
  try {
    const currentChannelId = getCurrentVoiceChannelId();
    if (!currentChannelId) {
      import_vendetta.logger.warn("[Quick Soundboard] You must be in a voice channel!");
      return false;
    }
    const ChannelStore = (0, import_metro.findByProps)("getChannel");
    const channel = ChannelStore == null ? void 0 : ChannelStore.getChannel(currentChannelId);
    const guildId = (_b = (_a = channel == null ? void 0 : channel.guild_id) != null ? _a : sound.guildId) != null ? _b : "0";
    import_common.FluxDispatcher.dispatch({
      type: "GUILD_SOUNDBOARD_SOUND_PLAY_START",
      soundId: sound.soundId,
      channelId: currentChannelId,
      guildId
    });
    import_vendetta.logger.log(`[Quick Soundboard] Playing sound: ${sound.name}`);
    return true;
  } catch (e) {
    import_vendetta.logger.error("[Quick Soundboard] Failed to play sound:", e);
    return false;
  }
}
function Settings() {
  var _a, _b;
  const { ScrollView, View, Text, TextInput, TouchableOpacity } = import_common.ReactNative;
  (_a = typedStorage.enabled) != null ? _a : typedStorage.enabled = true;
  (_b = typedStorage.favorites) != null ? _b : typedStorage.favorites = [];
  const [soundIdInput, setSoundIdInput] = import_common.React.useState("");
  const handleAddSound = () => {
    if (!soundIdInput.trim()) return;
    typedStorage.favorites.push({
      soundId: soundIdInput.trim(),
      name: `Sound #${soundIdInput.trim().slice(-4)}`
    });
    setSoundIdInput("");
  };
  return /* @__PURE__ */ import_common.React.createElement(ScrollView, { style: { padding: 16, backgroundColor: "#2f3136" } }, /* @__PURE__ */ import_common.React.createElement(Text, { style: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 16 } }, "Quick Soundboard (Revenge)"), /* @__PURE__ */ import_common.React.createElement(View, { style: { marginBottom: 20 } }, /* @__PURE__ */ import_common.React.createElement(Text, { style: { color: "#b9bbbe", fontSize: 14, marginBottom: 8 } }, "Add Sound ID:"), /* @__PURE__ */ import_common.React.createElement(
    TextInput,
    {
      style: {
        backgroundColor: "#202225",
        color: "#fff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#4f545c"
      },
      placeholder: "e.g. 1054951789318909972",
      placeholderTextColor: "#72767d",
      value: soundIdInput,
      onChangeText: (v) => setSoundIdInput(v),
      keyboardType: "numeric"
    }
  ), /* @__PURE__ */ import_common.React.createElement(
    TouchableOpacity,
    {
      style: {
        backgroundColor: "#5865f2",
        padding: 12,
        borderRadius: 8,
        alignItems: "center"
      },
      onPress: handleAddSound
    },
    /* @__PURE__ */ import_common.React.createElement(Text, { style: { color: "#fff", fontWeight: "bold" } }, "+ Add Sound")
  )), /* @__PURE__ */ import_common.React.createElement(Text, { style: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 10 } }, "Favorites (", typedStorage.favorites.length, ")"), typedStorage.favorites.map((sound, index) => /* @__PURE__ */ import_common.React.createElement(View, { key: index, style: { flexDirection: "row", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ import_common.React.createElement(
    TouchableOpacity,
    {
      style: {
        backgroundColor: "#4f545c",
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 8
      },
      onPress: () => playSound(sound)
    },
    /* @__PURE__ */ import_common.React.createElement(Text, { style: { color: "#fff", fontWeight: "600" } }, "\u25B6 ", sound.name)
  ), /* @__PURE__ */ import_common.React.createElement(
    TouchableOpacity,
    {
      style: { backgroundColor: "#ed4245", padding: 12, borderRadius: 8 },
      onPress: () => {
        typedStorage.favorites.splice(index, 1);
      }
    },
    /* @__PURE__ */ import_common.React.createElement(Text, { style: { color: "#fff", fontWeight: "bold" } }, "\u2715")
  ))));
}
function onLoad() {
  var _a, _b;
  import_vendetta.logger.log("[Quick Soundboard] Loaded!");
  (_a = typedStorage.enabled) != null ? _a : typedStorage.enabled = true;
  (_b = typedStorage.favorites) != null ? _b : typedStorage.favorites = [];
}
function onUnload() {
  import_vendetta.logger.log("[Quick Soundboard] Unloaded!");
}
module.exports = {
  onLoad,
  onUnload,
  playSound,
  settings: () => Settings()
};
