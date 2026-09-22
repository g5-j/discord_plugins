// QuickSoundboard/src/index.ts
import { storage as storage2 } from "@vendetta/plugin";
import { logger } from "@vendetta";

// QuickSoundboard/src/Settings.tsx
import { React, ReactNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
var { ScrollView, View } = ReactNative;
var { FormSection, FormInput, FormSwitchRow, FormText } = Forms;
var typedStorage = storage;
function Settings() {
  useProxy(typedStorage);
  typedStorage.enabled ??= true;
  typedStorage.favorites ??= [];
  return /* @__PURE__ */ React.createElement(ScrollView, { style: { paddingBottom: 24 } }, /* @__PURE__ */ React.createElement(View, { style: { padding: 16 } }, /* @__PURE__ */ React.createElement(FormSection, { title: "Quick Soundboard Settings" }, /* @__PURE__ */ React.createElement(
    FormSwitchRow,
    {
      label: "Enable Overlay Hotkeys",
      subLabel: "Show quick sound options when connected to voice",
      value: typedStorage.enabled,
      onValueChange: (v) => {
        typedStorage.enabled = v;
      }
    }
  )), /* @__PURE__ */ React.createElement(FormSection, { title: "Favorite Sounds (Configured: {typedStorage.favorites.length})" }, /* @__PURE__ */ React.createElement(FormText, { style: { marginBottom: 12 } }, "Add Sound IDs below to quickly trigger them in voice channels."), /* @__PURE__ */ React.createElement(
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
import { findByProps } from "@vendetta/metro";
import { FluxDispatcher } from "@vendetta/metro/common";
var SoundboardStore = findByProps("getSounds", "getSoundById");
var VoiceStateStore = findByProps("getVoiceChannelId");
var ChannelStore = findByProps("getChannel");
function playSound(sound) {
  const currentChannelId = VoiceStateStore.getVoiceChannelId();
  if (!currentChannelId) return false;
  const channel = ChannelStore.getChannel(currentChannelId);
  const guildId = channel?.guild_id ?? sound.guildId ?? "0";
  FluxDispatcher.dispatch({
    type: "GUILD_SOUNDBOARD_SOUND_PLAY_START",
    soundId: sound.soundId,
    channelId: currentChannelId,
    guildId
  });
  return true;
}

// QuickSoundboard/src/index.ts
var typedStorage2 = storage2;
var index_default = {
  onLoad() {
    logger.log("[Quick Soundboard] Plugin Loaded Successfully.");
    typedStorage2.enabled ??= true;
    typedStorage2.favorites ??= [];
  },
  onUnload() {
    logger.log("[Quick Soundboard] Plugin Unloaded.");
  },
  // دالة برمجية لاستدعاء الصوت الأول المفضل
  triggerQuickSound(index = 0) {
    if (!typedStorage2.enabled) return;
    const currentChannel = VoiceStateStore.getVoiceChannelId();
    if (!currentChannel) {
      logger.warn("[Quick Soundboard] Not connected to any voice channel.");
      return;
    }
    const sound = typedStorage2.favorites[index];
    if (sound) {
      const success = playSound(sound);
      if (success) {
        logger.log(`[Quick Soundboard] Playing sound: ${sound.name}`);
      }
    } else {
      logger.warn("[Quick Soundboard] No favorite sound configured at index: " + index);
    }
  },
  settings: Settings
};
export {
  index_default as default
};
