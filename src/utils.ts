import { findByProps } from "@vendetta/metro";
import { FluxDispatcher } from "@vendetta/metro/common";

export const SoundboardStore = findByProps("getSounds", "getSoundById");
export const VoiceStateStore = findByProps("getVoiceChannelId");
export const ChannelStore = findByProps("getChannel");

export interface SoundItem {
  soundId: string;
  name: string;
  emojiName?: string;
  guildId?: string;
}

export function playSound(sound: SoundItem) {
  const currentChannelId = VoiceStateStore.getVoiceChannelId();
  if (!currentChannelId) return false;

  const channel = ChannelStore.getChannel(currentChannelId);
  const guildId = channel?.guild_id ?? sound.guildId ?? "0";

  FluxDispatcher.dispatch({
    type: "GUILD_SOUNDBOARD_SOUND_PLAY_START",
    soundId: sound.soundId,
    channelId: currentChannelId,
    guildId: guildId,
  });

  return true;
}
