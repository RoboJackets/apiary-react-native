
import React, { createContext, ReactNode, useContext, useState } from 'react';

export type AppEnvironment = {
  name: string;
  production: boolean;
  baseUrl: string;
};

type AppEnvironmentList = {
  [label: string]: AppEnvironment;
};

export const APP_ENVIRONMENTS: AppEnvironmentList = {
  production: {
    name: 'Production',
    production: true,
    baseUrl: 'https://my.robojackets.org',
  },
  test: {
    name: 'Test',
    production: false,
    baseUrl: 'https://apiary-test.robojackets.org',
  },
  demo: {
    name: 'Demo',
    production: false,
    baseUrl: 'https://apiary-google-play-review.robojackets.org',
  },
};

type EnvironmentContextType = {
  environment: AppEnvironment;
  setEnvironment: (env: AppEnvironment) => void;
};

const AppEnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export function AppEnvironmentProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironment] = useState(APP_ENVIRONMENTS.production);
  return (
    <AppEnvironmentContext.Provider value={{ environment, setEnvironment }}>
      {children}
    </AppEnvironmentContext.Provider>
  );
}

export function useAppEnvironment() {
  const context = useContext(AppEnvironmentContext);
  if (!context) throw new Error('useEnvironment must be used inside EnvironmentProvider');
  return context;
}
