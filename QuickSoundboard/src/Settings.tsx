import { React, ReactNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { playSound, SoundItem } from "./index";

const { ScrollView, View } = ReactNative;
const { FormSection, FormInput, FormSwitchRow, FormButton, FormText } = Forms;

const typedStorage = storage as typeof storage & {
  enabled: boolean;
  favorites: SoundItem[];
};

export default function Settings() {
  useProxy(typedStorage);

  // إعداد القيمة الافتراضية إذا كانت فارغة
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
    <ScrollView style={{ paddingBottom: 24 }}>
      <View style={{ padding: 16 }}>
        <FormSection title="General Settings">
          <FormSwitchRow
            label="Enable Soundboard"
            subLabel="Master switch for quick soundboard functionality"
            value={typedStorage.enabled}
            onValueChange={(v: boolean) => {
              typedStorage.enabled = v;
            }}
          />
        </FormSection>

        <FormSection title="Add Favorite Sound">
          <FormInput
            title="Sound ID"
            placeholder="Paste Discord Sound ID here"
            value={soundIdInput}
            onChange={(v: string) => setSoundIdInput(v)}
            keyboardType="numeric"
          />
          <FormButton
            text="Add to Favorites"
            onPress={handleAddSound}
          />
        </FormSection>

        <FormSection title={`Favorite Sounds (${typedStorage.favorites.length})`}>
          {typedStorage.favorites.length === 0 ? (
            <FormText style={{ padding: 8 }}>No favorite sounds added yet.</FormText>
          ) : (
            typedStorage.favorites.map((sound, index) => (
              <View key={index} style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
                <FormButton
                  text={`▶ Play ${sound.name}`}
                  onPress={() => playSound(sound)}
                />
              </View>
            ))
          )}
        </FormSection>
      </View>
    </ScrollView>
  );
}
