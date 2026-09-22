// QuickSoundboard/src/index.ts
var import_metro = require("@vendetta/metro");
var import_common = require("@vendetta/metro/common");
var import_plugin = require("@vendetta/plugin");
var import_vendetta = require("@vendetta");
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
