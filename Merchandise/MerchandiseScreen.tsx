import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Button, Text, View } from 'react-native';

function MerchandiseScreen() {

    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Merchandise Screen</Text>
      <Button title="Go to Attendance" onPress={() => navigation.navigate('Attendance')} />
      <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
    );
}

export default MerchandiseScreen;