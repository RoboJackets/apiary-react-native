import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Button, Text, View } from 'react-native';

function AttendanceScreen() {

    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Attendance Screen</Text>
        <Button title="Go to Merchandise" onPress={() => navigation.navigate('Merchandise')} />
        <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
    );
}

export default AttendanceScreen;