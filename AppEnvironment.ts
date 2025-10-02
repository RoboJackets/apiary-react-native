
//TODO: Figure out how to make this environment dynamic based on the app environment selected by the user
//Additionally allow selecting app environment from the login screen.
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


