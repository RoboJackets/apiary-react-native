import { Platform } from 'react-native';
import { authorize, AuthorizeResult } from 'react-native-app-auth';
import * as Keychain from 'react-native-keychain';
import { currentEnvironment } from '../AppEnvironment';
import config from './AuthConfig';

export enum AuthenticationState {
    LOGOUT,
    AUTHENTICATED,
    ERROR,
};

export async function login() {
    let result: AuthorizeResult | null = null;
    let securityLevel = Platform.OS === 'ios'? undefined : Keychain.SECURITY_LEVEL.ANY;
    let storage = Platform.OS === 'ios'? undefined : Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH;

    try {
        let conf = await config();
        if (conf)
            result = await authorize(conf);
    } catch (error) {
        console.log(`Login error: ${error}`);
        return false;
    }
    
    let options: Keychain.SetOptions = {
        securityLevel: securityLevel,
        storage: storage,
    };
    if (result) {
        let store_success = await Keychain.setInternetCredentials(
            currentEnvironment.baseUrl + ':accessToken',
            'accessToken',
            result.accessToken,
            options,
        );
        let expiry_store_success = await Keychain.setInternetCredentials(
            currentEnvironment.baseUrl + ':accessExpiry',
            'accessExpiry',
            result.accessTokenExpirationDate,
            options,
        );
        let refresh_store_success = await Keychain.setInternetCredentials(
            currentEnvironment.baseUrl + ':refreshToken',
            'refreshToken',
            result.refreshToken,
            options,
        );
        if (store_success && expiry_store_success && refresh_store_success) {
            return true;
        }
    }
    return false;
}

export async function authTokenIsValid() {
    let expiry = await Keychain.getInternetCredentials(currentEnvironment.baseUrl + ':accessExpiry');
    if (! expiry) {
        return false;
    }
    
    let currentTime = Date.now();
    if (currentTime > parseInt(expiry.password)) {
        return true;
    }
    return false;
}

export async function refreshAuth() {
    
}

export async function logout() {

    await Keychain.resetInternetCredentials(
        {server: currentEnvironment.baseUrl + ':accessToken'}
    );
    await Keychain.resetInternetCredentials(
        {server: currentEnvironment.baseUrl + ':refreshToken'}
    );
    await Keychain.resetInternetCredentials(
        {server: currentEnvironment.baseUrl + ':accessExpiry'}
    );
}
