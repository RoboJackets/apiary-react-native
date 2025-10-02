
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { logout, refreshAuth } from '../Auth/Authentication';

function SettingsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
        
        return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Settings Screen</Text>
            <Button title="Log out" onPress={logout} />
            <Button title="Refresh token" onPress={refreshAuth} />
        </View>
        );
}

export default SettingsScreen;