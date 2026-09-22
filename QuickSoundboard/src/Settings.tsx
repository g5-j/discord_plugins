import { React, ReactNative } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";
import { SoundItem } from "./utils";

const { ScrollView, View } = ReactNative;
const { FormSection, FormInput, FormSwitchRow, FormText } = Forms;

const typedStorage = storage as typeof storage & {
  enabled: boolean;
  favorites: SoundItem[];
};

export default function Settings() {
  useProxy(typedStorage);

  typedStorage.enabled ??= true;
  typedStorage.favorites ??= [];

  return (
    <ScrollView style={{ paddingBottom: 24 }}>
      <View style={{ padding: 16 }}>
        <FormSection title="Quick Soundboard Settings">
          <FormSwitchRow
            label="Enable Overlay Hotkeys"
            subLabel="Show quick sound options when connected to voice"
            value={typedStorage.enabled}
            onValueChange={(v: boolean) => {
              typedStorage.enabled = v;
            }}
          />
        </FormSection>

        <FormSection title={`Favorite Sounds (Configured: ${typedStorage.favorites.length})`}>
          <FormText style={{ marginBottom: 12 }}>
            Add Sound IDs below to quickly trigger them in voice channels.
          </FormText>
          <FormInput
            title="Add Sound ID"
            placeholder="e.g. 1054951789318909972"
            keyboardType="numeric"
            onSubmitEditing={(e: any) => {
              const text = e.nativeEvent.text;
              if (text) {
                typedStorage.favorites.push({
                  soundId: text,
                  name: `Sound #${text.slice(-4)}`
                });
              }
            }}
          />
        </FormSection>
      </View>
    </ScrollView>
  );
}
