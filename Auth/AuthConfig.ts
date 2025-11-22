import { AuthConfiguration } from 'react-native-app-auth';
import { AppEnvironment } from '../AppEnvironment';

/**
 * Generates a configuration to send OAuth servers for authentication or refresh.
 * Relies on the current app environment to determine which URL to use.
 * @returns Current authentication config or null
 */
export default async function config(
  environment: AppEnvironment,
): Promise<AuthConfiguration | null> {
  const response = await fetch(environment.baseUrl + '/api/v1/info');

  if (!response.ok) {
    return null;
  }

  const json = await response.json();

  const config: AuthConfiguration = {
    issuer: environment.baseUrl,
    clientId: json.info.oAuthClients.reactNative.clientId,
    redirectUrl: 'org.robojackets.apiary://oauth',
    scopes: [],
  };

  return config;
}
