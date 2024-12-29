import { App, LangchainToolkit } from 'vity-toolkit';
import { StorageProvider } from 'vity-toolkit/src/storage-providers';

const toolkit = new LangchainToolkit({
    appPrivateKey: process.env.DEMO_SOLANA_PRIVATE_KEY,
    storageProvider: StorageProvider.PINATA
});


// 1. First get the expected params for the integration
// Get the expected params for the integration and fill in the required values
// const expectedParams = toolkit.getExpectedParamsForIntegration({ app: App.REDDIT });
// console.log(expectedParams);

// You will get this params from the console log
const params = {
    CLIENT_ID: "",
    CLIENT_SECRET: "",
}

params.CLIENT_ID = process.env.REDDIT_CLIENT_ID!;
params.CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET!;


// 2. Check if the integration already exists, pass the params to the isIntegration method
const iDetails = await toolkit.isIntegration({ app: App.REDDIT });

if (iDetails.success) {
    console.log("Integration already exists!");
} else {
    // Initiate the integration
    await toolkit.appIntegration({
        app: App.REDDIT,
        authData: params,
    })
}


