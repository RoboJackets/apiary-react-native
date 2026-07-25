import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import nfcManager from 'react-native-nfc-manager';
import ThemedText from '../../Components/ThemedText';
import { useTheme } from '../../Themes/ThemeContextProvider';

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
          <ThemedText style={styles.headerText} title="NFC is unsupported" />
          <ThemedText
            style={styles.bodyText}
            title="NFC capability is unsupported on this device."
          />
        </View>
      ) : !restart ? (
        <View style={[styles.view, { backgroundColor: currentTheme.background }]}>
          <MaterialIcons
            name={'error-outline'}
            size={100}
            color={currentTheme.error}
            style={styles.errorIcon}
          />
          <ThemedText style={styles.headerText} title="NFC is disabled" />
          <ThemedText
            style={styles.bodyText}
            title="Please enable NFC and restart the app to continue"
          />
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
          <ThemedText style={styles.headerText} title="Restart to continue" />
          <ThemedText
            style={styles.bodyText}
            title="If you've enabled NFC, just restart the app and you'll be on your way!"
          />
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
