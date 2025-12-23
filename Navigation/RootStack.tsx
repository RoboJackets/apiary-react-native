import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import NfcManager from 'react-native-nfc-manager';
import { AuthContext } from '../Auth/AuthContextProvider';
import { AuthenticationState } from '../Auth/Authentication';
import AuthenticationScreen from '../Auth/AuthenticationScreen';
import LoadingScreen from '../Components/LoadingScreen';
import NfcEnabledScreen from '../Nfc/NfcEnabledScreen';
import NavBar from './NavBar';

const Stack = createNativeStackNavigator();
type NfcState = 'enabled' | 'disabled' | 'unsupported';

function RootStack() {
  const auth = useContext(AuthContext);
  const [nfcEnabled, setNfcEnabled] = useState<NfcState>('disabled');

  useEffect(() => {
    const isEnabled = async () => {
      try {
        const isSupported = await NfcManager.isSupported();
        if (!isSupported) {
          setNfcEnabled('unsupported');
          return;
        }
        if (Platform.OS === 'android') {
          const enabled = await NfcManager.isEnabled();
          setNfcEnabled(enabled ? 'enabled' : 'disabled');
        } else if (Platform.OS === 'ios') {
          setNfcEnabled('enabled');
        } else {
          // Platform.OS === "windows" | "macos" | "web"
          console.log('Not a valid platform for NFC');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    isEnabled();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        title: 'MyRoboJackets',
        headerStyle: {
          backgroundColor: '#EEB211',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 24,
        },
      }}
    >
      {nfcEnabled !== 'enabled' ? (
        <Stack.Screen name="NfcEnabledScreen">
          {() => <NfcEnabledScreen nfcEnabled={nfcEnabled} />}
        </Stack.Screen>
      ) : auth?.authenticated !== null ? (
        auth?.authenticated === AuthenticationState.AUTHENTICATED ? (
          <Stack.Screen name="Main" component={NavBar} />
        ) : (
          <Stack.Screen name="Authentication">{() => <AuthenticationScreen />}</Stack.Screen>
        )
      ) : (
        <Stack.Screen name="Loading" component={LoadingScreen} />
      )}
    </Stack.Navigator>
  );
}

export default RootStack;
