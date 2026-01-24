import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DarkMode, LightMode, Theme } from './Themes';

type ThemeContextType = {
  currentTheme: Theme;
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

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}