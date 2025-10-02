import { jwtDecode } from 'jwt-decode';
import { Platform } from 'react-native';
import { authorize, AuthorizeResult, refresh } from 'react-native-app-auth';
import * as Keychain from 'react-native-keychain';
import { currentEnvironment } from '../AppEnvironment';
import config from './AuthConfig';

export enum AuthenticationState {
    UNAUTHENTICATED,
    AUTHENTICATED,
    ERROR,
    UNKNOWN,
};
var currentAuthState: AuthenticationState = AuthenticationState.UNKNOWN;
let authStateListeners: ((s: AuthenticationState) => void)[] = [];
export var authError: string = '';

/**
 * Performs OAuth login using config obtained from AuthConfig.
 * If the OAuth config cannot be obtained, the user cancels the login, or a network error occurs,
 * returns false and optionally sets authError to an error string.
 * Attempts to store tokens in secure storage on the device using Keychain.
 * @returns boolean: true if login succeeded, false otherwise
 */
export async function login() {
    let result: AuthorizeResult | null = null;

    try {
        let conf = await config();
        if (conf) {
            result = await authorize(conf);
        } else {
            setAuthenticationState(
                AuthenticationState.ERROR, 
                `Failed to fetch authentication config from the server. Check your network connection and try again.`);
            return false;
        }

    } catch (error) {
        setAuthenticationState(
            AuthenticationState.ERROR, 
            `Failed to log in: ${error}. Please try again or contact #it-helpdesk for help.`);
        return false;
    }
    
    if (result) {
        const store_success = await storeCredentials(result.accessToken, result.refreshToken);
        if (store_success) {
            setAuthenticationState(AuthenticationState.AUTHENTICATED, null);
            return true;
        } else {
            setAuthenticationState(
                AuthenticationState.ERROR,
                `Failed to store authentication result. Please try again or contact #it-helpdesk for help.`);
            return false;
        }
    }
    setAuthenticationState(AuthenticationState.UNAUTHENTICATED, null);
    return false;
}

/**
 * Stores keys as Internet Credentials with service name baseUrl + :<tokenType>.
 * @param authToken string: Access token
 * @param refreshToken string: Refresh token
 * @returns boolean: Whether or not storing keys was successful
 */
async function storeCredentials(authToken: string, refreshToken: string) {
    let securityLevel = Platform.OS === 'ios'? undefined : Keychain.SECURITY_LEVEL.ANY;
    let storage = Platform.OS === 'ios'? undefined : Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH;
    let options: Keychain.SetOptions = {
        securityLevel: securityLevel,
        storage: storage,
    };

    let store_success = await Keychain.setInternetCredentials(
        currentEnvironment.baseUrl + ':accessToken',
        'accessToken',
        authToken,
        options,
    );
    let refresh_store_success = await Keychain.setInternetCredentials(
        currentEnvironment.baseUrl + ':refreshToken',
        'refreshToken',
        refreshToken,
        options,
    );
    if (store_success && refresh_store_success) {
        return true;
    }
    return false;
}

/**
 * Checks for existence of auth token and whether it is expired.
 * @returns whether auth token is currently valid.
 */
export async function authTokenIsValid() {
    let token = await Keychain.getInternetCredentials(currentEnvironment.baseUrl + ':accessToken');
    if (! token) {
        return false;
    }

    let expiry = jwtDecode(token.password).exp;
    if (! expiry) {
        return false;
    }
    
    let currentTime = Date.now();
    if (currentTime > expiry) {
        return true;
    }
    return false;
}

/**
 * Checks for existence of a refresh token. Refresh tokens do not store an expiration date.
 * @returns whether or not a refresh token exists
 */
export async function refreshTokenIsValid() {
    let token = await (Keychain.getInternetCredentials(currentEnvironment.baseUrl + ':refreshToken'));
    if (! token || ! token.password) {
        return false;
    }
    return true;
}

/**
 * Attempts an authentication refresh, stores keys if successful, returns false and sets an error message if not.
 * @returns Whether or not refresh was successful.
 */
export async function refreshAuth() {
    let canRefresh = await refreshTokenIsValid();
    if (! canRefresh) {
        setAuthenticationState(AuthenticationState.UNAUTHENTICATED, null);
        return false;
    }
    let refreshToken = await Keychain.getInternetCredentials(currentEnvironment.baseUrl + ':refreshToken');
    if (! refreshToken) {
        setAuthenticationState(AuthenticationState.UNAUTHENTICATED, null);
        return false;
    }
    const conf = await config();
    if (! conf) {
        setAuthenticationState(
            AuthenticationState.ERROR, 
            `Failed to fetch authentication config from the server. Check your network connection and try again.`);
        return false;
    }
    try {
        const result = await refresh(conf, {
            refreshToken: refreshToken.password,
        });

        if (result) {
            let store_success = false;
            if (result.refreshToken) {
                store_success =  await storeCredentials(result.accessToken, result.refreshToken);
            } else {
                store_success =  await storeCredentials(result.accessToken, refreshToken.password);
            }
            if (store_success) {
                setAuthenticationState(AuthenticationState.AUTHENTICATED, null);
                return true;
            }
            setAuthenticationState(
                AuthenticationState.ERROR,
                `Failed to store authentication result. Please try again or contact #it-helpdesk for help.`);
            return false;
        }
    } catch (error) {
        setAuthenticationState(AuthenticationState.ERROR,
        `Authentication failed: ${error}. Please log in again or contact #it-helpdesk for assistance.`);
        return false;
    }

    setAuthenticationState(AuthenticationState.UNAUTHENTICATED, null);
    return false;
}

/**
 * Logs out of the app by deleting credentials and returning to login screen.
 */
export async function logout() {
    await Keychain.resetInternetCredentials(
        {server: currentEnvironment.baseUrl + ':accessToken'}
    );
    await Keychain.resetInternetCredentials(
        {server: currentEnvironment.baseUrl + ':refreshToken'}
    );
    setAuthenticationState(AuthenticationState.UNAUTHENTICATED, null);
}

/**
 * Sets currentAuthState and notifies listeners
 * @param authState desired AuthenticationState
 * @param error error if setting authState to ERROR
 */
export function setAuthenticationState(authState: AuthenticationState, error: string | null) {
    currentAuthState = authState;
    authError = error ?? '';
    authStateListeners.forEach((cb) => cb(authState));
}

export function getAuthenticationState() {
    return currentAuthState;
}

/**
 * Subscribes to the authentication state.
 * @param cb subscription function for AuthenticationState
 * @returns unsubscribe function for AuthenticationState
 */
export function subscribeAuthState(cb: (s: AuthenticationState) => void) {
  authStateListeners.push(cb);
  return () => {
    authStateListeners = authStateListeners.filter((fn) => fn !== cb);
  };
}