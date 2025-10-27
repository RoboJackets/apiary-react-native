import MaterialIcons from '@react-native-vector-icons/material-icons';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import nfcManager from 'react-native-nfc-manager';

type NfcEnabledProps = { 
    nfcEnabled: string,
};

function NfcEnabledScreen({nfcEnabled} : NfcEnabledProps) {
    const [restart, setRestart] = useState(false);

    const enableNfc = async () => {
        await nfcManager.goToNfcSetting();
        setRestart(true);
        return;
    }

    return (
        <>
        {
            nfcEnabled === "unsupported" ? 
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                <MaterialIcons name={"error-outline"} size={100} color="#b00020" style={{ padding: 10 }} />
                <Text style={{ fontSize: 30 }}>NFC is unsupported</Text>
                <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 20 }}>
                    NFC capability is unsupported on this device.
                </Text>
            </View> 
            :
            !restart ? 
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                <MaterialIcons name={"error-outline"} size={100} color="#b00020" style={{ padding: 10 }} />
                <Text style={{ fontSize: 30 }}>NFC is disabled</Text>
                <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 20 }}>
                    Please enable NFC and restart the app to continue
                </Text>
                <Button onPress={enableNfc} color="#EEB211" title="Enable NFC" />
            </View> 
            :
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                <MaterialIcons name={"error-outline"} size={100} color="#B78300" style={{ padding: 10 }} />
                <Text style={{ fontSize: 30 }}>Restart to continue</Text>
                <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 20 }}>
                    If you've enabled NFC, just restart the app and you'll be on your way!
                </Text>
            </View> 
        }
        </>
    );
}

export default NfcEnabledScreen;