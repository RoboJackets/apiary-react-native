import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { AuthContext } from '../App';
import AuthenticationScreen from '../Auth/AuthenticationScreen';
import NavBar from './NavBar';

const Stack = createNativeStackNavigator();

function RootStack() {
  const auth = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {auth?.authenticated ? (
        <Stack.Screen name="Main" component={NavBar} />
      ) : (
        <Stack.Screen name="Authentication">{() => <AuthenticationScreen />}</Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

export default RootStack;
