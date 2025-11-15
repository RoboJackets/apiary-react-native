import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Modal,
  NativeModules,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

interface NfcScanModalProps {
  scanning: boolean;
  appCmd: number[];
  readCmd: number[];
  modalText: string;
  callback: (error: Error | null, result: number[] | null) => void;
}

const NfcScanModal: React.FC<NfcScanModalProps> = (props: NfcScanModalProps) => {
  useEffect(() => {
    if (props.scanning) {
      void beginScan();
    }
  }, [props.scanning]);

  const beginScan = async () => {
    if (Platform.OS === 'ios') {
      const { BuzzCardReader } = NativeModules;
      BuzzCardReader.sendCommand(props.appCmd, props.readCmd, props.callback);
    } else if (Platform.OS === 'android') {
      try {
        await NfcManager.start();
        await NfcManager.requestTechnology(NfcTech.IsoDep);
        await NfcManager.getTag();
        await NfcManager.transceive(props.appCmd);
        const result = await NfcManager.transceive(props.readCmd);
        props.callback(null, result);
      } catch (error: unknown) {
        if (error instanceof Error) {
          props.callback(error, null);
        } else {
          props.callback(new Error(String(error)), null);
        }
      } finally {
        void NfcManager.cancelTechnologyRequest();
      }
    } else {
      console.log('Not a valid platform for NFC');
      props.callback(null, null);
    }
  };

  return (
    <Modal transparent visible={props.scanning && Platform.OS === 'android'} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" />
          <Text style={styles.text}>{props.modalText}</Text>
          <Pressable onPress={() => props.callback(null, null)} style={styles.button}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

// TODO: Add styles to mat
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 300,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: '#00000080',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    marginBottom: 24,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default NfcScanModal;
