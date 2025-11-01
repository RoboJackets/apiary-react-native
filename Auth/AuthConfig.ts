import { Platform } from "react-native";
import { AuthConfiguration } from "react-native-app-auth";
import { AppEnvironment } from "../AppEnvironment";

/**
 * Generates a configuration to send OAuth servers for authentication or refresh.
 * Relies on the current app environment to determine which URL to use.s
 * @returns Current authentication config or null
 */
export default async function config(environment: AppEnvironment): Promise<AuthConfiguration|null> {

    const response = await fetch(environment.baseUrl + '/api/v1/info');

    if (! response.ok) {
        return null;
    }

    const json = await response.json();

    const config: AuthConfiguration = {
        serviceConfiguration: {
            authorizationEndpoint: environment.baseUrl + '/oauth/authorize',
            tokenEndpoint: environment.baseUrl + '/oauth/token',
        },
        clientId: Platform.OS === 'android'? 
            json.info.oAuthClients.android.clientId 
            : json.info.oAuthClients.ios.clientId,
        redirectUrl: 'org.robojackets.apiary://oauth',
        scopes: [],
    };

    return config;
}
