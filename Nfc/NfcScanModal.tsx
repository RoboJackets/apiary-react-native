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

const NfcScanModal: React.FC<NfcScanModalProps> = (props: NfcScanModalProps) => {
    useEffect(() => {
        if (props.scanning) {
            beginScan();
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
                const tag = await NfcManager.getTag();
                await NfcManager.transceive(props.appCmd);
                let result = await NfcManager.transceive(props.readCmd);
                props.callback(null, result);
            } catch (error: any) {
                //console.log(error);
                props.callback(error, null);
            } finally {
                NfcManager.cancelTechnologyRequest();
            }
        } else {
            console.log("Not a valid platform for NFC");
            props.callback(null, null);
        }
    }

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