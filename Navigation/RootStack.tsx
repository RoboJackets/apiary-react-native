import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import NfcManager from 'react-native-nfc-manager';
import { AuthContext } from '../App';
import AuthenticationScreen from '../Auth/AuthenticationScreen';
import NfcEnabledScreen from '../Nfc/NfcEnabledScreen';
import NavBar from './NavBar';

const Stack = createNativeStackNavigator();
type NfcState = "enabled" | "disabled" | "unsupported";

function RootStack() {
    const [nfcEnabled, setNfcEnabled] = useState<NfcState>("disabled");

    useEffect(() => {
        const isEnabled = async () => {
            try {
                const isSupported = await NfcManager.isSupported();
                if (!isSupported) {
                    setNfcEnabled("unsupported");
                    return;
                }
                if (Platform.OS === 'android') {
                    const enabled = await NfcManager.isEnabled();
                    setNfcEnabled(enabled ? "enabled" : "disabled");
                } else if (Platform.OS === 'ios') {
                    setNfcEnabled("enabled");
                } else { // Platform.OS === "windows" | "macos" | "web"
                    console.log("Not a valid platform for NFC");
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        isEnabled();
    }, []); 
    
    const auth = useContext(AuthContext)
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
        { nfcEnabled !== "enabled"? 
            <Stack.Screen name="NfcEnabledScreen">
                {() => <NfcEnabledScreen nfcEnabled={nfcEnabled} />}
            </Stack.Screen>
        :
        auth?.authenticated? 
            <Stack.Screen name="Main" component={NavBar} />
        :
            <Stack.Screen name="Authentication">
                {() => <AuthenticationScreen />}
            </Stack.Screen>
        }
        </Stack.Navigator>
    )
}

export default RootStack;