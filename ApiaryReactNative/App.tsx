/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { Button, NativeModules, Platform, StyleSheet, Text, useColorScheme, View } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

function App() {
  const { BuzzCardReader } = NativeModules;
  const isDarkMode = useColorScheme() === 'dark';
  const [readerText, setReaderText] = useState("No text found");

  async function readNfc() {
    try {
      const selectApp = [0x90, 0x5A, 0x00, 0x00, 0x03, 0xCD, 0xBB, 0xBB, 0x00];
      const readFile = [0x90, 0xBD, 0x00, 0x00, 0x07, 0x01, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00];

      const callback = (error: Error, res: number[]) => {
        if (error) {
          setReaderText(error.message);
        } else {
          setReaderText(res.toString());
        }
      }
      if (Platform.OS === 'ios') {
        BuzzCardReader.readGtid(callback);
      } else if (Platform.OS === 'android') {
        await NfcManager.start();
        await NfcManager.requestTechnology(NfcTech.IsoDep);
        const tag = await NfcManager.getTag();
        await NfcManager.transceive(selectApp);
        const result = await NfcManager.transceive(readFile);
        setReaderText(result.toString());
      } else {
        setReaderText("Not currently set up to read NFC.")
      }
    } catch (error) {
      if (error instanceof Error) {
        setReaderText(error.message);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.baseText}>
        {readerText}
      </Text>
      <Button title="Scan" onPress={readNfc} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    baseText: {
    fontFamily: 'Cochin',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default App;
