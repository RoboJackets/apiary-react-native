
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { useAppEnvironment } from '../AppEnvironment';
import { logout, refreshAuth } from '../Auth/Authentication';

function SettingsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    
    const {environment, setEnvironment} = useAppEnvironment();

    return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{environment.baseUrl}</Text>
        <Button title="Log out" onPress={() => logout(environment)} />
        <Button title="Refresh token" onPress={() => refreshAuth(environment)} />
    </View>
    );
}

export default SettingsScreen;