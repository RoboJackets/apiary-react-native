import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import AttendanceScreen from '../Attendance/AttendanceScreen';
import MerchandiseScreen from '../Merchandise/MerchandiseScreen';
import SettingsScreen from '../Settings/SettingsScreen';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Merchandise" component={MerchandiseScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default RootStack;