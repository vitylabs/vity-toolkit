import { App, LangchainToolkit } from 'vity-toolkit';

const toolkit = new LangchainToolkit({
    appPrivateKey: process.env.DEMO_SOLANA_PRIVATE_KEY
});

// 1. First get the expected params for the integration
// Get the expected params for the integration and fill in the required values
const expectedParams = toolkit.getExpectedParamsForIntegration({ app: App.TWITTER });
console.log(expectedParams);

// You will get this params from the console log
const params = {
    APP_KEY: "",
    APP_SECRET: "",
}

params.APP_KEY = "YOUR_APP_KEY";
params.APP_SECRET = "YOUR_APP_SECRET";

// 2. Check if the integration already exists, pass the params to the isIntegration method
const iDetails = await toolkit.isIntegration({ app: App.TWITTER });

if (iDetails.success) {
    console.log("Integration already exists!");
} else {
    // Initiate the integration
    await toolkit.appIntegration({
        app: App.TWITTER,
        authData: params,
    })
}


