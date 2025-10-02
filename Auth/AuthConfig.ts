import { Platform } from "react-native";
import { AuthConfiguration } from "react-native-app-auth";
import { currentEnvironment } from "../AppEnvironment";

var authConfig: AuthConfiguration | null = null;

export default async function getConfig(): Promise<AuthConfiguration|null> {
    if (authConfig) {
        return authConfig;
    }

    let baseUrl: string = currentEnvironment.baseUrl;
    let response = await fetch(baseUrl + '/api/v1/info');

    if (! response.ok) {
        return null;
    }

    let json = await response.json();

    let config: AuthConfiguration = {
        serviceConfiguration: {
            authorizationEndpoint: baseUrl + '/oauth/authorize',
            tokenEndpoint: baseUrl + '/oauth/token',
        },
        clientId: Platform.OS === 'android'? 
            json.info.oAuthClients.android.clientId 
            : json.info.oAuthClients.ios.clientId,
        redirectUrl: 'org.robojackets.apiary://oauth',
        scopes: [],
    };

    authConfig = config;

    return config;
}
