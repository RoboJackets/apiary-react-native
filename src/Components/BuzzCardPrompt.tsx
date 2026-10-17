import React, { useEffect, useRef, useState } from 'react';
import { Modal, NativeModules, Platform, StyleSheet, TextInput, View } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { NfcSource } from '../constants/api/Models/Attendance';
import { READ_FILE, SELECT_APP } from '../constants/BuzzCardReadCommands';
import { useTheme } from '../Themes/ThemeContextProvider';
import { ActionPrompt } from './ActionPrompt';
import RoundedButton from './RoundedButton';
import ThemedText from './ThemedText';

// Names taken from Android App
export type BuzzCardState =
  | 'TagLost'
  | 'NotABuzzCard'
  | 'InvalidBuzzCardData'
  | 'UnknownNfcError'
  | 'Ready'
  | 'Processing'
  | 'BadInternet';

export type BuzzCardTap = {
  gtid: number;
  source: NfcSource;
};

interface BuzzCardPromptProps {
  onBuzzCardTap: (tap: BuzzCardTap) => Promise<void> | void;
  paused?: boolean; // Used by Merchandise screen, when confirming pickup
}

const BuzzCardPrompt: React.FC<BuzzCardPromptProps> = ({ onBuzzCardTap, paused = false }) => {
  const { currentTheme } = useTheme();
  const [buzzCardState, setBuzzCardState] = useState<BuzzCardState>('Ready');
  const [enterGTIDManually, setEnterGTIDManually] = useState<boolean>(false);
  const isMountedRef = useRef(true);
  const pausedRef = useRef(paused);
  const onBuzzCardTapRef = useRef(onBuzzCardTap);

  // Update ref with onBuzzCardTap function passed in
  useEffect(() => {
    onBuzzCardTapRef.current = onBuzzCardTap;
  }, [onBuzzCardTap]);

  useEffect(() => {
    return () => {
      // Mark as unmounted so callbacks don't update state
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    if (!paused) {
      beginScan();
    }
    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, [paused]);

  /**
   * Scanning function that is called to process buzzcard taps
   */
  const beginScan = async () => {
    if (Platform.OS === 'ios') {
      const { BuzzCardReader } = NativeModules;
      BuzzCardReader.sendCommand(SELECT_APP, READ_FILE, handleNfcResult);
    } else if (Platform.OS === 'android') {
      try {
        await NfcManager.start();
        await NfcManager.requestTechnology(NfcTech.IsoDep);
        await NfcManager.getTag();
        await NfcManager.transceive(SELECT_APP);
        const result = await NfcManager.transceive(READ_FILE);
        handleNfcResult(null, result);
      } catch (error: unknown) {
        handleNfcResult(error instanceof Error ? error : new Error(String(error)), null);
      } finally {
        NfcManager.cancelTechnologyRequest();
      }
    } else {
      console.error('Not a valid platform for NFC');
      handleNfcResult(null, null);
    }
  };

  /**
   * Callback function for scan modal
   * @param error
   * @param result Scanned GTID in char code format or null
   * @returns none
   */
  const handleNfcResult = async (error: Error | null, result: number[] | null) => {
    if (!isMountedRef.current) return; // ← drop stale callbacks entirely

    if (error) {
      const errorMsg = error.message || '';
      if (errorMsg.includes('Wrong CLA')) {
        setBuzzCardState('NotABuzzCard');
      } else if (errorMsg.includes('Tag was lost') || errorMsg.includes('Incomplete response')) {
        setBuzzCardState('TagLost');
      } else if (
        errorMsg.includes('cancelled') || // ios wording
        errorMsg.includes('canceled') ||
        errorMsg.includes('UserCancel') ||
        errorMsg.includes('Tech request was cancelled') // android wording
      ) {
        // intentional cancellation on unmount — do nothing
        return;
      } else {
        setBuzzCardState('UnknownNfcError');
      }
      return;
    }

    if (!result) {
      // User cancelled
      setBuzzCardState('Ready');
      beginScan();
      return;
    }

    const buzzString = String.fromCharCode(...result);
    const gtid = buzzString.substring(0, 9);
    await processGtid(gtid, NfcSource.NFC);
  };

  /**
   * Validates GTID format to use in POST request
   * @param gtid String GTID to be formatted into number
   * @param source NfcSource.KEYBOARD if manually entered, NfcSource.NFC if scanned
   * @returns none
   */
  const processGtid = async (gtid: string, source: NfcSource) => {
    setEnterGTIDManually(false); // closes the modal, not related to manual param
    // Validate GTID format
    if (!/^90[0-9]{7}$/.test(gtid)) {
      setBuzzCardState('InvalidBuzzCardData');
      return;
    }

    // Try to parse as integer (catches NumberFormatException equivalent)
    const gtidNumber = parseInt(gtid, 10);
    if (isNaN(gtidNumber)) {
      setBuzzCardState('InvalidBuzzCardData');
      return;
    }

    setBuzzCardState('Processing');
    try {
      await onBuzzCardTapRef.current({ gtid: gtidNumber, source });
      if (isMountedRef.current) setBuzzCardState('Ready');
    } catch {
      if (isMountedRef.current) setBuzzCardState('BadInternet');
    }

    if (source === NfcSource.NFC && isMountedRef.current && !pausedRef.current) {
      beginScan();
    }
  };

  /**
   * GTID Modal
   * @returns none
   */
  const EnterGTIDForm = () => {
    const [gtid, setGtid] = useState('');

    return (
      <Modal animationType="fade" transparent={true}>
        <View style={styles.viewContainer}>
          <View style={[styles.modalView, { backgroundColor: currentTheme.background }]}>
            <ThemedText
              style={styles.modalText}
              title="Type the entire 9-digit GTID, starting with 90."
            />
            <TextInput
              style={styles.modalInput}
              placeholder="90..."
              maxLength={9}
              onChangeText={(newGtid) => setGtid(newGtid)}
            ></TextInput>
            <View style={styles.modalButtonContainer}>
              <View style={styles.modalButton}>
                <RoundedButton
                  onPress={() => processGtid(gtid, NfcSource.KEYBOARD)}
                  title="Enter"
                  color={currentTheme.primary as string}
                  textColor="#000000"
                />
              </View>

              <View style={styles.modalButton}>
                <RoundedButton onPress={() => setEnterGTIDManually(false)} title="Close" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {enterGTIDManually && <EnterGTIDForm></EnterGTIDForm>}
      <View>
        {buzzCardState === 'Ready' ? (
          <ActionPrompt
            icon="contactless"
            title="Tap a BuzzCard"
            color={currentTheme.onBackground}
          ></ActionPrompt>
        ) : buzzCardState === 'TagLost' ? (
          <ActionPrompt
            icon="contactless"
            color={currentTheme.error}
            title="Card read error"
            subtitle="Hold the BuzzCard up to your phone for a few seconds"
            subtitle2="BuzzCard removed too quickly"
          ></ActionPrompt>
        ) : buzzCardState === 'NotABuzzCard' ? (
          <ActionPrompt
            icon="contactless"
            color={currentTheme.error}
            title="Card read error"
            subtitle="If you are tapping a BuzzCard, please hold it against your phone longer, or reach out in #it-helpdesk for assistance"
            subtitle2="We only support BuzzCards 😉"
          ></ActionPrompt>
        ) : buzzCardState === 'InvalidBuzzCardData' ? (
          <ActionPrompt
            icon="contactless"
            color={currentTheme.error}
            title="Card read error"
            subtitle="If you are tapping a BuzzCard, please hold it against your phone longer, or reach out in #it-helpdesk for assistance"
            subtitle2="Unexpected BuzzCard data format"
          ></ActionPrompt>
        ) : buzzCardState === 'BadInternet' ? (
          <ActionPrompt
            icon="contactless"
            color={currentTheme.error}
            title="Card read error"
            subtitle="The last tap was successful, but we couldn't save the data."
            subtitle2="Check your internet connection and try again."
          ></ActionPrompt>
        ) : buzzCardState === 'UnknownNfcError' ? (
          <ActionPrompt
            icon="contactless"
            color={currentTheme.error}
            title="Card read error"
            subtitle="Something went wrong while reading this card. If the problem continues, reach out in #it-helpdesk for assistance"
            subtitle2="Unknown NFC read error"
          ></ActionPrompt>
        ) : (
          // buzzCardState === 'Processing'
          <ActionPrompt
            icon="contactless"
            title="Processing..."
            color={currentTheme.onBackground}
          ></ActionPrompt>
        )}
        <View style={styles.modalButtonContainer}>
          {Platform.OS === 'ios' && ( // only relevant to ios, after modal closed to display error
            <View style={styles.modalButton}>
              <RoundedButton
                onPress={() => {
                  beginScan();
                }}
                title="Scan Card"
                color={currentTheme.primary as string}
                textColor="#000000"
              />
            </View>
          )}
          <View style={styles.modalButton}>
            <RoundedButton
              onPress={() => {
                setEnterGTIDManually(true);
              }}
              title="Enter GTID manually"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  modalButton: {
    alignSelf: 'center',
    marginHorizontal: 5,
  },
  modalButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  modalInput: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  modalText: {
    fontSize: 20,
    marginVertical: 20,
    textAlign: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    margin: 20,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '75%',
  },
  viewContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    margin: 10,
  },
});

export default BuzzCardPrompt;
