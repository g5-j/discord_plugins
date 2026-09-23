import { findByProps } from "@vendetta/metro";
import { FluxDispatcher } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { logger } from "@vendetta";
import { showToast } from "@vendetta/ui/toasts";

export interface SoundItem {
  soundId: string;
  name?: string;
  guildId?: string;
}

function safeFindByProps(...props: string[]) {
  try {
    return findByProps(...props);
  } catch (e) {
    logger.error(`[Quick Soundboard] Failed to find props: ${props.join(", ")}`, e);
    return null;
  }
}

function getCurrentVoiceChannelId(): string | null {
  try {
    const VoiceStateStore = safeFindByProps("getVoiceChannelId");
    return VoiceStateStore?.getVoiceChannelId() ?? null;
  } catch (e) {
    logger.error("[Quick Soundboard] Error fetching voice channel:", e);
    return null;
  }
}

function playSound(sound: SoundItem): boolean {
  try {
    const currentChannelId = getCurrentVoiceChannelId();
    if (!currentChannelId) {
      showToast("You must be in a voice channel!", safeFindByProps("getAssetIDByName")?.("Small"));
      return false;
    }

    const ChannelStore = safeFindByProps("getChannel");
    const channel = ChannelStore?.getChannel(currentChannelId);
    const guildId = channel?.guild_id ?? sound.guildId ?? "0";

    FluxDispatcher.dispatch({
      type: "GUILD_SOUNDBOARD_SOUND_PLAY_START",
      soundId: sound.soundId,
      channelId: currentChannelId,
      guildId: guildId,
    });

    return true;
  } catch (e) {
    logger.error("[Quick Soundboard] Failed to play sound:", e);
    return false;
  }
}

function onLoad() {
  try {
    logger.log("[Quick Soundboard] Plugin Loaded Successfully!");
    
    showToast("Quick Soundboard Activated!", safeFindByProps("getAssetIDByName")?.("Check"));

    if (storage) {
      const typedStorage = storage as any;
      typedStorage.enabled ??= true;
      typedStorage.favorites ??= [];
    }
  } catch (err: any) {
    logger.error("[Quick Soundboard] Error in onLoad:", err);
  }
}

function onUnload() {
  try {
    logger.log("[Quick Soundboard] Plugin Unloaded!");
    showToast("Quick Soundboard Disabled!", safeFindByProps("getAssetIDByName")?.("Small"));
  } catch (err) {
    logger.error("[Quick Soundboard] Error in onUnload:", err);
  }
}

// التصدير بنظام CommonJS الخالص بدون أي كلمة export ثانية
module.exports = {
  onLoad,
  onUnload,
  playSound
};
