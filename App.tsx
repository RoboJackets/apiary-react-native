import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppEnvironmentProvider } from './AppEnvironment';
import ApiContextProvider from './src/Api/ApiContextProvider';
import AuthContextProvider from './src/App/Auth/AuthContextProvider';
import RootStack from './src/App/Navigation/RootStack';
import ThemeProvider from './src/Themes/ThemeContextProvider';

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
