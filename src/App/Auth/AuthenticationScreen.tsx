import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppEnvironment } from '../../../AppEnvironment';
import RoboBuzzSvg from '../../../public/ic_robobuzz_white_outline.svg';
import RoundedButton from '../../Components/RoundedButton';
import ThemedText from '../../Components/ThemedText';
import TransparentButton from '../../Components/TransparentButton';
import { AuthenticationState } from '../../constants/auth/AuthenticationState';
import { useTheme } from '../../Themes/ThemeContextProvider';
import { AuthContext } from './AuthContextProvider';
import * as Authentication from './Authentication';
import { authError } from './Authentication';
import EnvironmentSelect from './EnvironmentSelect';

function AuthenticationScreen() {
  const { currentTheme } = useTheme();
  const auth = useContext(AuthContext);
  const { environment } = useAppEnvironment();
  const [envChangeVisible, setEnvChangeVisible] = useState<boolean>(false);

  const login = async () => {
    await Authentication.login(environment);
  };
  useEffect(() => {
    if (auth?.authenticated === AuthenticationState.ERROR) {
      Alert.alert(
        'Authentication Error',
        authError ??
          'Authentication failed. Please try again or contact #it-helpdesk for assistance.',
        [
          {
            text: 'OK',
            onPress: () =>
              Authentication.setAuthenticationState(AuthenticationState.UNAUTHENTICATED, null),
          },
        ],
      );
    }
  }, [auth?.authenticated]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <View style={styles.upper}>
        <RoboBuzzSvg width="40%" height="40%" />
        <RoundedButton title="Sign in with MyRoboJackets" onPress={login} />
      </View>
      <View style={styles.lower}>
        <TransparentButton title="Change Server" onPress={() => setEnvChangeVisible(true)} />
        <ThemedText title={`Server: ${environment.name} (${environment.baseUrl})`} />
      </View>
      <EnvironmentSelect visible={envChangeVisible} onDismiss={() => setEnvChangeVisible(false)} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  lower: { alignItems: 'center', flexShrink: 1, padding: 10 },
  upper: { alignItems: 'center', flex: 1, justifyContent: 'space-around' },
});

export default AuthenticationScreen;
