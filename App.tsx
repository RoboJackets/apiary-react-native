import { NavigationContainer } from '@react-navigation/native';
import React, { createContext, ReactNode, useState } from 'react';
import RootStack from './Navigation/RootStack';

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

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
