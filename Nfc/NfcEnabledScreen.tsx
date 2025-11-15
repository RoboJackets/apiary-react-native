import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import nfcManager from 'react-native-nfc-manager';

type NfcEnabledProps = {
  nfcEnabled: string;
};

function NfcEnabledScreen({ nfcEnabled }: NfcEnabledProps) {
  const [restart, setRestart] = useState(false);

  const enableNfc = async () => {
    await nfcManager.goToNfcSetting();
    setRestart(true);
    return;
  };

  return (
    <>
      {nfcEnabled === 'unsupported' ? (
        <View style={styles.view}>
          <MaterialIcons
            name={'error-outline'}
            size={100}
            color="#b00020"
            style={styles.errorIcon}
          />
          <Text style={styles.headerText}>NFC is unsupported</Text>
          <Text style={styles.bodyText}>NFC capability is unsupported on this device.</Text>
        </View>
      ) : !restart ? (
        <View style={styles.view}>
          <MaterialIcons
            name={'error-outline'}
            size={100}
            color="#b00020"
            style={styles.errorIcon}
          />
          <Text style={styles.headerText}>NFC is disabled</Text>
          <Text style={styles.bodyText}>Please enable NFC and restart the app to continue</Text>
          <Button onPress={enableNfc} color="#EEB211" title="Enable NFC" />
        </View>
      ) : (
        <View style={styles.view}>
          <MaterialIcons
            name={'error-outline'}
            size={100}
            color="#B78300"
            style={styles.errorIcon}
          />
          <Text style={styles.headerText}>Restart to continue</Text>
          <Text style={styles.bodyText}>
            {`If you've enabled NFC, just restart the app and you'll be on your way!`}
          </Text>
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
    margin: 10,
  },
});

export default NfcEnabledScreen;
