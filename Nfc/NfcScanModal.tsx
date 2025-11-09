import React, { useEffect } from 'react';
import { ActivityIndicator, Modal, NativeModules, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

interface NfcScanModalProps {
    scanning: boolean;
    appCmd: number[];
    readCmd: number[];
    modalText: string;
    callback: (error: Error | null, result: number[] | null) => void;
}
// These are used for BuzzCard reading and will be needed later.
//   const selectApp = [0x90, 0x5A, 0x00, 0x00, 0x03, 0xCD, 0xBB, 0xBB, 0x00];
//   const readFile = [0x90, 0xBD, 0x00, 0x00, 0x07, 0x01, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00];

const NfcScanModal: React.FC<NfcScanModalProps> = (props: NfcScanModalProps) => {
    
    useEffect(() => {
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
                    let result = await NfcManager.transceive(props.readCmd);
                    props.callback(null, result);
                } catch (error: any) {
                    props.callback(error, null);
                } finally {
                    NfcManager.cancelTechnologyRequest();
                }
            } else {
                console.log("Not a valid platform for NFC");
                props.callback(null, null);
            }
        }
        if (props.scanning) {
            beginScan();
        }
    }, [props]);

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
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        width: 300,
    },
    text: {
        marginTop: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#007AFF',
        borderRadius: 6,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
});

export default NfcScanModal;