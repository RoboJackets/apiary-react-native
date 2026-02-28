import React, { useState } from 'react';
import { Button, Modal, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useApi } from '../Api/ApiContextProvider';
import { EventInfo, postAttendance, TeamInfo } from '../Api/MeetingsApi';
import { AttendableType, NfcSource } from '../Api/Models/Attendance';
import { ActionPrompt } from '../Components/ActionPrompt';
import NfcScanModal from '../Nfc/NfcScanModal';
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
  totalAttendees: number;
  setTotalAttendees: (state: number) => void;
  lastAttendee: LastAttendeeProps | null;
  setLastAttendee: (state: LastAttendeeProps) => void;
}

const BuzzCardPrompt: React.FC<BuzzCardPromptProps> = ({
  attendanceType,
  attendable,
  totalAttendees,
  setTotalAttendees,
  lastAttendee,
  setLastAttendee,
}) => {
  const api = useApi();
  const { currentTheme } = useTheme();
  const [buzzCardState, setBuzzCardState] = useState<BuzzCardState>('Ready');
  const [enterGTIDManually, setEnterGTIDManually] = useState<boolean>(false);
  const [scanIos, setScanIos] = useState<boolean>(true);

  // Callback function for NfcScanModal
  const handleNfcResult = async (error: Error | null, result: number[] | null) => {
    if (error) {
      // TODO: Validate that error.message actually contains these formats
      setScanIos(false); // closes modal so you can see the error
      switch (error.message) {
        case 'Wrong CLA':
          setBuzzCardState('NotABuzzCard');
          break;
        case 'Tag was lost.':
          setBuzzCardState('TagLost');
          break;
        case 'Incomplete response':
          setBuzzCardState('TagLost');
          break;
        default:
          setBuzzCardState('UnknownNfcError');
      }
      return;
    }

    if (!result) {
      // User cancelled
      setBuzzCardState('Ready');
      return;
    }

    const buzzString = String.fromCharCode(...result);
    const gtid = buzzString.substring(0, 9);
    processGtid(gtid);
  };

  const processGtid = async (gtid: string) => {
    try {
      setEnterGTIDManually(false);
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

      await onBuzzCardTap(gtidNumber, NfcSource.NFC);
      setBuzzCardState('Ready');
    } catch (error) {
      setBuzzCardState('InvalidBuzzCardData');
    }
  };

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

      if (!lastAttendee || lastAttendee.id !== gtid) {
        setTotalAttendees(totalAttendees + 1);
      }

      const attendeeName = res.data.attendance.attendee?.name ?? 'Non-member';
      setLastAttendee({
        id: gtid,
        name: attendeeName,
      });

      setBuzzCardState('Ready');
    } catch (error) {
      setBuzzCardState('BadInternet');
    }
  };

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
                  onPress={() => processGtid(gtid)}
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
      {scanIos && (
        <NfcScanModal
          scanning={true}
          appCmd={selectApp}
          readCmd={readFile}
          modalText="Tap a BuzzCard"
          callback={handleNfcResult}
        ></NfcScanModal>
      )}
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
                  setScanIos(true);
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
