import { createContext, ReactNode, useEffect, useState } from "react";
import { authTokenIsValid } from "./Authentication";

type AuthContextType = {
  authenticated: boolean | null;
  setAuthenticated: (u: boolean ) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextProvider({children}: AuthProviderProps) {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    authTokenIsValid()
    .then((auth) => {
      if (auth) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    }).catch((e) => {
      setAuthenticated(false);
    });
  }, []);
  return(
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;