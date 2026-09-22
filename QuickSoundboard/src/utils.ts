import { findByProps } from "@vendetta/metro";
import { FluxDispatcher } from "@vendetta/metro/common";

export interface SoundItem {
  soundId: string;
  name: string;
  emojiName?: string;
  guildId?: string;
}

// جلب الموديلات بأمان عند طلبها
export const getVoiceStateStore = () => findByProps("getVoiceChannelId");
export const getChannelStore = () => findByProps("getChannel");

export function playSound(sound: SoundItem) {
  const VoiceStateStore = getVoiceStateStore();
  const ChannelStore = getChannelStore();

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
}
