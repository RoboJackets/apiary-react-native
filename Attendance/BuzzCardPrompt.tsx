import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Modal,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { useApi } from '../Api/ApiContextProvider';
import { EventInfo, postAttendance, TeamInfo } from '../Api/MeetingsApi';
import { AttendableType, NfcSource } from '../Api/Models/Attendance';
import { ActionPrompt } from '../Components/ActionPrompt';
import { useTheme } from '../Themes/ThemeContextProvider';
import { LastAttendeeProps } from './TapABuzzCard';

const selectApp = [0x90, 0x5a, 0x00, 0x00, 0x03, 0xcd, 0xbb, 0xbb, 0x00];
const readFile = [0x90, 0xbd, 0x00, 0x00, 0x07, 0x01, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00];

// Names taken from Android App
export type BuzzCardState =
  | 'TagLost'
  | 'NotABuzzCard'
  | 'InvalidBuzzCardData'
  | 'UnknownNfcError'
  | 'Ready'
  | 'Processing'
  | 'BadInternet';

interface BuzzCardPromptProps {
  attendanceType: AttendableType;
  attendable: TeamInfo | EventInfo;
  setTotalAttendees: React.Dispatch<React.SetStateAction<number>>; // accepts either number or function
  setLastAttendee: (state: LastAttendeeProps) => void;
}

const BuzzCardPrompt: React.FC<BuzzCardPromptProps> = ({
  attendanceType,
  attendable,
  setTotalAttendees,
  setLastAttendee,
}) => {
  const api = useApi();
  const { currentTheme } = useTheme();
  const [buzzCardState, setBuzzCardState] = useState<BuzzCardState>('Ready');
  const [enterGTIDManually, setEnterGTIDManually] = useState<boolean>(false);
  const lastGtidRef = useRef<number | null>(null); // keep track of last gtid to prevent duplicates

  useEffect(() => {
    beginScan();
  }, []);

  /**
   * Scanning function that is called to process buzzcard taps
   */
  const beginScan = async () => {
    if (Platform.OS === 'ios') {
      const { BuzzCardReader } = NativeModules;
      BuzzCardReader.sendCommand(selectApp, readFile, handleNfcResult);
    } else if (Platform.OS === 'android') {
      try {
        await NfcManager.start();
        await NfcManager.requestTechnology(NfcTech.IsoDep);
        await NfcManager.getTag();
        await NfcManager.transceive(selectApp);
        const result = await NfcManager.transceive(readFile);
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
    if (error) {
      const errorMsg = error.message || '';
      if (errorMsg.includes('Wrong CLA')) {
        setBuzzCardState('NotABuzzCard');
      } else if (errorMsg.includes('Tag was lost') || errorMsg.includes('Incomplete response')) {
        setBuzzCardState('TagLost');
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
    await processGtid(gtid, false);
  };

  /**
   * Validates GTID format to use in POST request
   * @param gtid String GTID to be formatted into number
   * @param manual True if GTID was entered via modal, false if entered via NFC scan
   * @returns none
   */
  const processGtid = async (gtid: string, manual: boolean) => {
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

    if (manual) {
      await onBuzzCardTap(gtidNumber, NfcSource.KEYBOARD);
    } else {
      await onBuzzCardTap(gtidNumber, NfcSource.NFC);
    }

    setBuzzCardState('Ready');
    if (!manual) beginScan();
  };

  /**
   * Makes post request via Axios given GTID and NFC Source
   * @param gtid Number GTID
   * @param source Keyboard or NFC
   * @returns none
   */
  const onBuzzCardTap = async (gtid: number, source: NfcSource) => {
    setBuzzCardState('Processing');

    const props = {
      attendable_type: attendanceType,
      attendable_id: attendable.id,
      gtid: gtid,
      source: `MyRoboJackets ${Platform.OS === 'ios' ? 'iOS' : 'Android'} - ${source}`,
    };

    try {
      const res = await postAttendance(api, props);
      if (!res.success) {
        setBuzzCardState('BadInternet');
        return;
      }

      if (lastGtidRef.current !== gtid) {
        setTotalAttendees((prev) => prev + 1);
        lastGtidRef.current = gtid;
      }
      const attendeeName = res.data.attendance.attendee?.name ?? 'Non-member';
      setLastAttendee({
        id: gtid,
        name: attendeeName,
      });
    } catch (error) {
      setBuzzCardState('BadInternet');
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
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Type the entire 9-digit GTID, starting with 90</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="90..."
              maxLength={9}
              onChangeText={(newGtid) => setGtid(newGtid)}
            ></TextInput>
            <View style={styles.modalButtonContainer}>
              <View style={styles.modalButton}>
                <Button
                  onPress={() => processGtid(gtid, true)}
                  color={currentTheme.primary}
                  title="Enter"
                />
              </View>

              <View style={styles.modalButton}>
                <Button onPress={() => setEnterGTIDManually(false)} title="Close" />
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
          <ActionPrompt icon="contactless" title="Tap a BuzzCard"></ActionPrompt>
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
          <ActionPrompt icon="contactless" title="Processing..."></ActionPrompt>
        )}
        <View style={styles.modalButtonContainer}>
          {Platform.OS === 'ios' && ( // only relevant to ios, after modal closed to display error
            <View style={styles.modalButton}>
              <Button
                onPress={() => {
                  beginScan();
                }}
                color={currentTheme.primary}
                title="Scan Card"
              />
            </View>
          )}
          <View style={styles.modalButton}>
            <Button
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
