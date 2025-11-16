import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppEnvironment } from '../AppEnvironment';
import RoundedButton from '../Components/RoundedButton';
import TransparentButton from '../Components/TransparentButton';
import RoboBuzzSvg from '../icons/ic_robobuzz_white_outline.svg';
import { AuthContext } from './AuthContextProvider';
import * as Authentication from './Authentication';
import { authError } from './Authentication';
import EnvironmentSelect from './EnvironmentSelect';

function AuthenticationScreen() {
  const auth = useContext(AuthContext);
    const auth = useContext(AuthContext);
    const {environment} = useAppEnvironment();
    const [envChangeVisible, setEnvChangeVisible] = useState<boolean>(false);

    const login = async () => {
        await Authentication.login(environment);
    };
    useEffect(() => {
        if (auth?.authenticated === Authentication.AuthenticationState.ERROR) {
            Alert.alert("Authentication Error", 
                authError ?? 'Authentication failed. Please try again or contact #it-helpdesk for assistance.', 
                [{ text: "OK", onPress: () => Authentication.setAuthenticationState(Authentication.AuthenticationState.UNAUTHENTICATED, null) }]);
        }
        }, [auth?.authenticated]);

    return (
    <SafeAreaView style={styles.container}>
        <View style={styles.upper}>
            <RoboBuzzSvg width="40%" height="40%" />
            <RoundedButton title="Sign in with MyRoboJackets" onPress={ login } />
        </View>
        <View style={styles.lower}>
            <TransparentButton title="Change Server" onPress={() => setEnvChangeVisible(true)} />
            <Text>Server: {environment.name} ({environment.baseUrl})</Text>
    
        </View>
        <EnvironmentSelect
            visible={envChangeVisible}
            onDismiss={() => setEnvChangeVisible(false)} />
    </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    upper: { flex: 1, justifyContent: "space-around", alignItems: "center" },
    lower: { flexShrink: 1, padding: 10, alignItems: "center" },
});

export default AuthenticationScreen;
