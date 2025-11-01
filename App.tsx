import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppEnvironmentProvider } from './AppEnvironment';
import AuthContextProvider from './Auth/AuthContextProvider';
import RootStack from './Navigation/RootStack';

function App() {

  return (
    <AppEnvironmentProvider>
      <SafeAreaProvider>
        <AuthContextProvider>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </AuthContextProvider>
      </SafeAreaProvider>
    </AppEnvironmentProvider>
  );
}

export default App;
