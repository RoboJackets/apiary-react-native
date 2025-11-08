import { NavigationContainer } from '@react-navigation/native';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { NativeModules, StyleSheet, useColorScheme } from 'react-native';
import RootStack from './Navigation/RootStack';
import { DarkMode, LightMode, Theme } from './Themes/Themes';

type AuthContextType = {
  authenticated: boolean | null;
  setAuthenticated: (u: boolean ) => void;
};

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({children}: AuthProviderProps) {
  const [authenticated, setAuthenticated] = useState(false);
  return(
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
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
    if(currentSystemTheme === "light"){
        setTheme(LightMode);
    } else{
        setTheme(DarkMode)
    }
  },[currentSystemTheme])

  return(
    <ThemeContext.Provider value={{currentTheme, setTheme}}>
      {children}
    </ThemeContext.Provider>

  )
}


function App() {
  const { BuzzCardReader } = NativeModules;
  const [readerText, setReaderText] = useState("No text found");
  const [scanning, setScanning] = useState(false);
  const selectApp = [0x90, 0x5A, 0x00, 0x00, 0x03, 0xCD, 0xBB, 0xBB, 0x00];
  const readFile = [0x90, 0xBD, 0x00, 0x00, 0x07, 0x01, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00];

  async function readNfc() {
    setScanning(true);
  }


  /*return (
    <View style={styles.container}>
      <Text style={styles.baseText}>
        {readerText}
      </Text>
      <Button title="Scan" onPress={readNfc} />
      <NfcScanModal scanning={scanning} appCmd={selectApp} 
      readCmd={readFile} modalText='Place your BuzzCard near the phone.'
      callback={(error, result) => {
        if (error) {
          setReaderText(error.message);
        } else {
          //setReaderText(result?.toString() ?? 'yeet');
          setReaderText(typeof result);
        }
        setScanning(false);
      }}/>
    </View>
  );*/
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    baseText: {
    fontFamily: 'Cochin',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default App;
