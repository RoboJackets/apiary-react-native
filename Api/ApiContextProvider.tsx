import axios, { AxiosInstance } from 'axios';
import React, { createContext, ReactNode, useContext } from 'react';
import { AppEnvironment, useAppEnvironment } from '../AppEnvironment';
import { getAuthToken, refreshAuth } from '../Auth/Authentication';

/**
 * Context containing API configuration for the app.
 * Includes authentication and automatic refresh logic.
 */
export const ApiContext = createContext<AxiosInstance | undefined>(undefined);

/**
 * Creates API context in the form of a preconfigured Axios instance.
 * Sets base URL to the current app environment, adds interceptors for
 * requests to pass in authorization tokens and to retry with refresh tokens
 * if any 401 errors occur.
 * @param environment AppEnvironment containing the Base URL to use.
 * @returns AxiosInstance for the API context.
 */
function createApiContext(environment: AppEnvironment) {
    const instance = axios.create({
        baseURL: environment.baseUrl,
    });

    instance.interceptors.request.use(async (config) => {
        const token = await getAuthToken(environment);
        console.log(config.baseURL);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(config.headers.Authorization);
        }

        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                if (!error.config) return Promise.reject(error);
                if (!await refreshAuth(environment)) return Promise.reject(error);
                const token = await getAuthToken(environment);
                if (token) {
                    error.config.headers.Authorization = `Bearer ${token.password}`;
                    return axios.request(error.config);
                }
            }
            return Promise.reject(error);
        }
    );
    return instance;
}

function ApiContextProvider({ children }: {children: ReactNode}) {
  const { environment } = useAppEnvironment();
  const apiContext = createApiContext(environment);

  return (
    <ApiContext.Provider value={apiContext}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiContextProvider');
  }
  return context;
}

export default ApiContextProvider;
