import { App, LangchainToolkit } from 'vity-toolkit';
import { AuthType } from 'vity-toolkit/src/sdk/types';
import { StorageProvider } from 'vity-toolkit/src/storage-providers';


const toolkit = new LangchainToolkit({
    appPrivateKey: "3C82AFmHn64h2gYGQbPHFrQB9bJzT5hfSGXuTwpf9RCX59yvusZd5DhVMmq9AYbgRNooGqdY2D2oJqvPAX8CLnGv",
    userPrivateKey: "3C82AFmHn64h2gYGQbPHFrQB9bJzT5hfSGXuTwpf9RCX59yvusZd5DhVMmq9AYbgRNooGqdY2D2oJqvPAX8CLnGv",
    storageProvider: StorageProvider.PINATA
});


// 1. First get the expected params for the integration
// Get the expected params for the integration and fill in the required values
// const expectedParams = toolkit.getExpectedParamsForConnection({ app: App.REDDIT, type: AuthType.PASSWORD_BASED_AUTH });
// console.log(expectedParams);

// You will get this params from the console log
const params = {
    USERNAME: "",
    PASSWORD: "",
}

params.USERNAME = process.env.REDDIT_USERNAME!;
params.PASSWORD = process.env.REDDIT_PASSWORD!;


// 2. Check if the integration already exists, pass the params to the isIntegration method
const iDetails = await toolkit.isConnection({ app: App.REDDIT });

if (iDetails.success) {
    console.log("Connection already exists!");
} else {
    // Initiate the integration
    await toolkit.initiateAppConnection({
        app: App.REDDIT,
        type: AuthType.PASSWORD_BASED_AUTH,
        authData: params,
    })
}


