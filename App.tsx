import { NavigationContainer } from '@react-navigation/native';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ApiContextProvider from './Api/ApiContextProvider';
import { AppEnvironmentProvider } from './AppEnvironment';
import AuthContextProvider from './Auth/AuthContextProvider';
import RootStack from './Navigation/RootStack';
import { DarkMode, LightMode, Theme } from './Themes/Themes';

type ThemeContextType = {
  currentTheme: Theme | null | undefined;
  setTheme: (t: Theme) => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setTheme] = useState<Theme>(LightMode);
  const currentSystemTheme = useColorScheme();

  useEffect(() => {
    currentSystemTheme === 'light' ? setTheme(LightMode) : setTheme(DarkMode);
  }, [currentSystemTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>{children}</ThemeContext.Provider>
  );
}

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
