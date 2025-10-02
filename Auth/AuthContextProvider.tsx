import { createContext, ReactNode, useEffect, useState } from "react";
import { AuthenticationState, authTokenIsValid, getAuthenticationState, refreshAuth, setAuthenticationState, subscribeAuthState } from "./Authentication";

type AuthContextType = {
  authenticated: AuthenticationState | null;
  setAuthenticated: (u: AuthenticationState ) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextProvider({children}: AuthProviderProps) {

  async function loggedIn() {
    const valid = await authTokenIsValid();
    if (valid) {
      setAuthenticationState(AuthenticationState.AUTHENTICATED, null);
      return true;
    }

    const refreshSuccess = await refreshAuth();
    return refreshSuccess;
  }

  const [authenticated, setAuthenticated] = useState<AuthenticationState | null>(() => getAuthenticationState());

  useEffect(() => {

    const unsubscribe = subscribeAuthState((state) => {
      setAuthenticated(state);
    });
    loggedIn();
  }, []);
  return(
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;