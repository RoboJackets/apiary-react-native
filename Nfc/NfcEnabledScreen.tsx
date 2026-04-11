import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import nfcManager from 'react-native-nfc-manager';
import ThemedText from '../Components/ThemedText';
import { useTheme } from '../Themes/ThemeContextProvider';

type NfcEnabledProps = {
  nfcEnabled: string;
};

function NfcEnabledScreen({ nfcEnabled }: NfcEnabledProps) {
  const { currentTheme } = useTheme();
  const [restart, setRestart] = useState(false);

  const enableNfc = async () => {
    await nfcManager.goToNfcSetting();
    setRestart(true);
    return;
  };

  return (
    <>
      {nfcEnabled === 'unsupported' ? (
        <View style={[styles.view, { backgroundColor: currentTheme.background }]}>
          <MaterialIcons
            name={'error-outline'}
            size={100}
            color={currentTheme.error}
            style={styles.errorIcon}
          />
          <ThemedText style={styles.headerText}>
            <Text>NFC is unsupported</Text>
          </ThemedText>
          <ThemedText style={styles.bodyText}>
            <Text>NFC capability is unsupported on this device.</Text>
          </ThemedText>
        </View>
      ) : !restart ? (
        <View style={[styles.view, { backgroundColor: currentTheme.background }]}>
          <MaterialIcons
            name={'error-outline'}
            size={100}
            color={currentTheme.error}
            style={styles.errorIcon}
          />
          <ThemedText style={styles.headerText}>
            <Text>NFC is disabled</Text>
          </ThemedText>
          <ThemedText style={styles.bodyText}>
            <Text>Please enable NFC and restart the app to continue</Text>
          </ThemedText>
          <Button onPress={enableNfc} color="#EEB211" title="Enable NFC" />
        </View>
      ) : (
        <View style={[styles.view, { backgroundColor: currentTheme.background }]}>
          <MaterialIcons
            name={'error-outline'}
            size={100}
            color={currentTheme.secondary}
            style={styles.errorIcon}
          />
          <ThemedText style={styles.headerText}>
            <Text>Restart to continue</Text>
          </ThemedText>
          <ThemedText style={styles.bodyText}>
            <Text>
              If you&apos;ve enabled NFC, just restart the app and you&apos;ll be on your way!
            </Text>
          </ThemedText>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  bodyText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorIcon: {
    padding: 10,
  },
  headerText: {
    fontSize: 30,
  },
  view: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
});

export default NfcEnabledScreen;
