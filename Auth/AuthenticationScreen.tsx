import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoundedButton from '../Components/RoundedButton';
import TransparentButton from '../Components/TransparentButton';
import RoboBuzzSvg from '../icons/ic_robobuzz_white_outline.svg';
import { AuthContext } from './AuthContextProvider';
import * as Authentication from './Authentication';


function AuthenticationScreen() {

    const auth = useContext(AuthContext);

    const login = async () => {
        auth?.setAuthenticated(await Authentication.login());
        await Authentication.authTokenIsValid();
    };

    return (
    <SafeAreaView style={styles.container}>
        {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Authentication Screen</Text>
            <Button title="Login" onPress={ login } />
        </View> */}
        <View style={styles.upper}>
            <RoboBuzzSvg width="40%" height="40%" />
            <RoundedButton title="Sign in with MyRoboJackets" onPress={ login } />
        </View>
        <View style={styles.lower}>
            <TransparentButton title="Change Server" onPress={() => null} />
            <Text>Server: Production (https://my.robojackets.org)</Text>
        </View>
    </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    upper: { flex: 1, justifyContent: "space-around", alignItems: "center" },
    lower: { flexShrink: 1, padding: 10, alignItems: "center" },
});

export default AuthenticationScreen;