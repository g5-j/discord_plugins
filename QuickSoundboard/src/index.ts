import { findByProps } from "@vendetta/metro";
import { FluxDispatcher } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { logger } from "@vendetta";

interface SoundItem {
  soundId: string;
  name: string;
  guildId?: string;
}

const typedStorage = storage as typeof storage & {
  enabled: boolean;
  favorites: SoundItem[];
};

export function playSound(sound: SoundItem) {
  try {
    const VoiceStateStore = findByProps("getVoiceChannelId");
    const ChannelStore = findByProps("getChannel");

    const currentChannelId = VoiceStateStore?.getVoiceChannelId();
    if (!currentChannelId) return false;

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

export default {
  onLoad() {
    logger.log("[Quick Soundboard] Plugin Loaded Successfully.");
    typedStorage.enabled ??= true;
    typedStorage.favorites ??= [];
  },

  onUnload() {
    logger.log("[Quick Soundboard] Plugin Unloaded.");
  }
};
