import { NavigationContainer } from '@react-navigation/native';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import RootStack from './Navigation/RootStack';
import { DarkMode, LightMode, Theme } from './Themes/Themes';

type AuthContextType = {
  authenticated: boolean | null;
  setAuthenticated: (u: boolean) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: AuthProviderProps) {
  const [authenticated, setAuthenticated] = useState(false);
  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}


type ThemeContextType = {
  currentTheme: Theme | null | undefined;
  setTheme: (t: Theme) => void;
};

type ThemeProviderProps = {
  children :ReactNode;
}

export const ThemeContext = createContext< ThemeContextType | undefined>(undefined);

function ThemeProvider({children}: ThemeProviderProps) {
  const [currentTheme, setTheme] = useState<Theme>(LightMode);
  const currentSystemTheme = useColorScheme();

  useEffect(() =>{
    currentSystemTheme === 'light' ? setTheme(LightMode) : setTheme(DarkMode);
  },[currentSystemTheme]);

  return(
    <ThemeContext.Provider value={{currentTheme, setTheme}}>
      {children}
    </ThemeContext.Provider>

  )
}


function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
