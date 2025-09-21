import React, { useContext } from 'react';
import { Button, Text, View } from 'react-native';
import { AuthContext } from '../App';


function AuthenticationScreen() {

    const auth = useContext(AuthContext);

    const login = () => {
        auth?.setAuthenticated(true);
    };

    return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Authentication Screen</Text>
        <Button title="Login" onPress={ login } />
    </View>
    );
}

export default AuthenticationScreen;