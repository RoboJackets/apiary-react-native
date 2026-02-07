import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ApiContextProvider from './Api/ApiContextProvider';
import { AppEnvironmentProvider } from './AppEnvironment';
import AuthContextProvider from './Auth/AuthContextProvider';
import RootStack from './Navigation/RootStack';
import ThemeProvider from './Themes/ThemeContextProvider';

function App() {
  return (
    <AppEnvironmentProvider>
      <SafeAreaProvider>
        <AuthContextProvider>
          <ApiContextProvider>
            <ThemeProvider>
              <NavigationContainer>
                <RootStack />
              </NavigationContainer>
            </ThemeProvider>
          </ApiContextProvider>
        </AuthContextProvider>
      </SafeAreaProvider>
    </AppEnvironmentProvider>
  );
}

export default App;
