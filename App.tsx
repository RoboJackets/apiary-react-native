import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';
import { NativeModules, StyleSheet, useColorScheme } from 'react-native';
import RootStack from './Navigation/RootStack';

function App() {
  const { BuzzCardReader } = NativeModules;
  const isDarkMode = useColorScheme() === 'dark';
  const [readerText, setReaderText] = useState("No text found");
  const [scanning, setScanning] = useState(false);

  const selectApp = [0x90, 0x5A, 0x00, 0x00, 0x03, 0xCD, 0xBB, 0xBB, 0x00];
  const readFile = [0x90, 0xBD, 0x00, 0x00, 0x07, 0x01, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00];

  async function readNfc() {
    setScanning(true);
  }

  /*return (
    <View style={styles.container}>
      <Text style={styles.baseText}>
        {readerText}
      </Text>
      <Button title="Scan" onPress={readNfc} />
      <NfcScanModal scanning={scanning} appCmd={selectApp} 
      readCmd={readFile} modalText='Place your BuzzCard near the phone.'
      callback={(error, result) => {
        if (error) {
          setReaderText(error.message);
        } else {
          //setReaderText(result?.toString() ?? 'yeet');
          setReaderText(typeof result);
        }
        setScanning(false);
      }}/>
    </View>
  );*/
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
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
