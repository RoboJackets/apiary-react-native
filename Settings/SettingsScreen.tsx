import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

function SettingsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
        
        return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Settings Screen</Text>
        </View>
        );
}

export default SettingsScreen;