import { findByProps } from "@vendetta/metro";
import { FluxDispatcher } from "@vendetta/metro/common";
import { logger } from "@vendetta";

export interface SoundItem {
  soundId: string;
  name: string;
  emojiName?: string;
  guildId?: string;
}

// 1. جلب الموديلات بأمان داخل الدوال لمنع خطأ undefined عند التشغيل الأولي
export const getVoiceStateStore = () => findByProps("getVoiceChannelId");
export const getChannelStore = () => findByProps("getChannel");
export const getSoundboardStore = () => findByProps("getSounds", "getSoundById");

/**
 * جلب معرف الروم الصوتي الحالي المتصل به المستخدم
 */
export function getCurrentVoiceChannelId(): string | null {
  try {
    const VoiceStateStore = getVoiceStateStore();
    return VoiceStateStore?.getVoiceChannelId() ?? null;
  } catch (e) {
    logger.error("[Quick Soundboard] Error fetching voice channel:", e);
    return null;
  }
}

/**
 * تشغيل صوت معتمد على ID الصوت وروم الصوت الحالي
 */
export function playSound(sound: SoundItem): boolean {
  try {
    const currentChannelId = getCurrentVoiceChannelId();
    if (!currentChannelId) {
      logger.warn("[Quick Soundboard] Not connected to any voice channel.");
      return false;
    }

    const ChannelStore = getChannelStore();
    const channel = ChannelStore?.getChannel(currentChannelId);
    const guildId = channel?.guild_id ?? sound.guildId ?? "0";

    // إرسال حدث ديسكورد الداخلي لتشغيل الصوت في الروم الصوتي
    FluxDispatcher.dispatch({
      type: "GUILD_SOUNDBOARD_SOUND_PLAY_START",
      soundId: sound.soundId,
      channelId: currentChannelId,
      guildId: guildId,
    });

    logger.log(`[Quick Soundboard] Successfully played sound: ${sound.name || sound.soundId}`);
    return true;
  } catch (e) {
    logger.error("[Quick Soundboard] Failed to play sound:", e);
    return false;
  }
}

/**
 * جلب قائمة الأصوات المتاحة في السيرفر الحالي أو كل السيرفرات (اختياري)
 */
export function getAllServerSounds(): SoundItem[] {
  try {
    const SoundboardStore = getSoundboardStore();
    const rawSounds = SoundboardStore?.getSounds();
    if (!rawSounds) return [];

    const soundsList: SoundItem[] = [];
    
    // تحويل البيانات القادمة من Store إلى تنسيق SoundItem
    Object.values(rawSounds).forEach((guildSounds: any) => {
      if (Array.isArray(guildSounds)) {
        guildSounds.forEach((s: any) => {
          soundsList.push({
            soundId: s.soundId,
            name: s.name,
            emojiName: s.emojiName,
            guildId: s.guildId
          });
        });
      }
    });

    return soundsList;
  } catch (e) {
    logger.error("[Quick Soundboard] Failed to fetch server sounds:", e);
    return [];
  }
}
