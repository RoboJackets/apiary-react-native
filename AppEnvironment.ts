
type AppEnvironmentList = {
    [label: string]: AppEnvironment;
}

type AppEnvironment = {
    production: boolean;
    baseUrl: string;
}

export const APP_ENVIRONMENTS: AppEnvironmentList  = {
    production: {
        production: true,
        baseUrl: 'https://my.robojackets.org',
    },
    test: {
        production: false,
        baseUrl: 'https://apiary-test.robojackets.org',
    },
    demo: {
        production: false,
        baseUrl: 'https://apiary-google-play-review.robojackets.org',
    },
};

export var currentEnvironment = APP_ENVIRONMENTS.test;


