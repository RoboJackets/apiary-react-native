import { NavigationContainer } from '@react-navigation/native';
import React, { createContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppEnvironmentProvider } from './AppEnvironment';
import AuthContextProvider from './Auth/AuthContextProvider';
import RootStack from './Navigation/RootStack';
import ThemeProvider from './Themes/ThemeContextProvider';

type AuthContextType = {
  authenticated: boolean | null;
  setAuthenticated: (u: boolean) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function App() {
  return (
    <AppEnvironmentProvider>
      <SafeAreaProvider>
        <AuthContextProvider>
          <ThemeProvider>
            <NavigationContainer>
              <RootStack />
            </NavigationContainer>
          </ThemeProvider>
        </AuthContextProvider>
      </SafeAreaProvider>
    </AppEnvironmentProvider>
  );
}

export default App;
