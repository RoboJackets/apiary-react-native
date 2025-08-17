import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Button, Text, View } from 'react-native';

function SettingsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    
        return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Settings Screen</Text>
            <Button title="Go to Attendance" onPress={() => navigation.navigate('Attendance')} />
            <Button title="Go to Merchandise" onPress={() => navigation.navigate('Merchandise')} />
        </View>
        );
}

export default SettingsScreen;