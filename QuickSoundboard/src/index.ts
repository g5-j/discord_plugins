import { findByProps } from "@vendetta/metro";
import { FluxDispatcher, React, ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { logger } from "@vendetta";

const { ScrollView, View, Text, TextInput, TouchableOpacity } = ReactNative;

export interface SoundItem {
  soundId: string;
  name: string;
  guildId?: string;
}

const typedStorage = storage as typeof storage & {
  enabled: boolean;
  favorites: SoundItem[];
};

// ==================== الدوال المساعدة (Utils) ====================

export function getCurrentVoiceChannelId(): string | null {
  try {
    const VoiceStateStore = findByProps("getVoiceChannelId");
    return VoiceStateStore?.getVoiceChannelId() ?? null;
  } catch (e) {
    logger.error("[Quick Soundboard] Error fetching voice channel:", e);
    return null;
  }
}

export function playSound(sound: SoundItem): boolean {
  try {
    const currentChannelId = getCurrentVoiceChannelId();
    if (!currentChannelId) {
      logger.warn("[Quick Soundboard] You must be in a voice channel!");
      return false;
    }

    const ChannelStore = findByProps("getChannel");
    const channel = ChannelStore?.getChannel(currentChannelId);
    const guildId = channel?.guild_id ?? sound.guildId ?? "0";

    FluxDispatcher.dispatch({
      type: "GUILD_SOUNDBOARD_SOUND_PLAY_START",
      soundId: sound.soundId,
      channelId: currentChannelId,
      guildId: guildId,
    });

    logger.log(`[Quick Soundboard] Playing sound: ${sound.name}`);
    return true;
  } catch (e) {
    logger.error("[Quick Soundboard] Failed to play sound:", e);
    return false;
  }
}

// ==================== واجهة الإعدادات (Settings) ====================

function Settings() {
  typedStorage.enabled ??= true;
  typedStorage.favorites ??= [];

  const [soundIdInput, setSoundIdInput] = React.useState("");

  const handleAddSound = () => {
    if (!soundIdInput.trim()) return;
    
    typedStorage.favorites.push({
      soundId: soundIdInput.trim(),
      name: `Sound #${soundIdInput.trim().slice(-4)}`
    });

    setSoundIdInput("");
  };

  return (
    <ScrollView style={{ padding: 16, backgroundColor: "#2f3136" }}>
      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
        Quick Soundboard (Revenge)
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: "#b9bbbe", fontSize: 14, marginBottom: 8 }}>Add Sound ID:</Text>
        <TextInput
          style={{
            backgroundColor: "#202225",
            color: "#fff",
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: "#4f545c"
          }}
          placeholder="e.g. 1054951789318909972"
          placeholderTextColor="#72767d"
          value={soundIdInput}
          onChangeText={(v: string) => setSoundIdInput(v)}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#5865f2",
            padding: 12,
            borderRadius: 8,
            alignItems: "center"
          }}
          onPress={handleAddSound}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>+ Add Sound</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
        Favorites ({typedStorage.favorites.length})
      </Text>

      {typedStorage.favorites.map((sound, index) => (
        <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#4f545c",
              padding: 12,
              borderRadius: 8,
              flex: 1,
              marginRight: 8
            }}
            onPress={() => playSound(sound)}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>▶ {sound.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: "#ed4245", padding: 12, borderRadius: 8 }}
            onPress={() => {
              typedStorage.favorites.splice(index, 1);
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

// ==================== إقلاع وتصدير البلوقن (Entry Point) ====================

function onLoad() {
  logger.log("[Quick Soundboard] Loaded!");
  typedStorage.enabled ??= true;
  typedStorage.favorites ??= [];
}

function onUnload() {
  logger.log("[Quick Soundboard] Unloaded!");
}

module.exports = {
  onLoad,
  onUnload,
  playSound,
  settings: () => Settings()
};
