import { storage } from "@vendetta/plugin";
import { logger } from "@vendetta";
import Settings from "./Settings";
import { playSound, getVoiceStateStore, SoundItem } from "./utils";

const typedStorage = storage as typeof storage & {
  enabled: boolean;
  favorites: SoundItem[];
};

export default {
  onLoad() {
    logger.log("[Quick Soundboard] Plugin Loaded Successfully.");
    
    // إعداد القيم الافتراضية
    typedStorage.enabled ??= true;
    typedStorage.favorites ??= [];
  },

  onUnload() {
    logger.log("[Quick Soundboard] Plugin Unloaded.");
  },

  triggerQuickSound(index = 0) {
    if (!typedStorage.enabled) return;
    
    const VoiceStateStore = getVoiceStateStore();
    const currentChannel = VoiceStateStore?.getVoiceChannelId();
    if (!currentChannel) {
      logger.warn("[Quick Soundboard] Not connected to any voice channel.");
      return;
    }

    const sound = typedStorage.favorites[index];
    if (sound) {
      const success = playSound(sound);
      if (success) {
        logger.log(`[Quick Soundboard] Playing sound: ${sound.name}`);
      }
    } else {
      logger.warn("[Quick Soundboard] No favorite sound configured at index: " + index);
    }
  },

  settings: Settings,
};
