import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import NfcManager from 'react-native-nfc-manager';
import { AuthContext } from '../App';
import AuthenticationScreen from '../Auth/AuthenticationScreen';
import NfcEnabledScreen from '../Nfc/NfcEnabledScreen';
import NavBar from './NavBar';

const Stack = createNativeStackNavigator();

function RootStack() {
    const [nfcEnabled, setNfcEnabled] = useState<boolean>(false);

    useEffect(() => {
        if (Platform.OS === 'android') {
            const isEnabled = async () => { 
                try {
                    const isEnabled = await NfcManager.isEnabled();
                    setNfcEnabled(isEnabled);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            isEnabled();
        } else if (Platform.OS !== 'ios') { // nfc capability is always enabled on iOS
            // Platform.OS == "windows" | "macos" | "web", realistically shouldn't happen
            console.log("Not a valid platform for NFC");
        }
    }, []); 
    
    const auth = useContext(AuthContext)
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
        { !nfcEnabled? 
            <Stack.Screen name="NfcEnabledScreen" component={NfcEnabledScreen} />
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