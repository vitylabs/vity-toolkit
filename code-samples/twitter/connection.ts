import { VityToolKit } from "vity-toolkit";


const toolkit = new VityToolKit({
    userPrivateKey: process.env.DEMO_SOLANA_PRIVATE_KEY,
    appPrivateKey: process.env.DEMO_SOLANA_PRIVATE_KEY
});

// const params = toolkit.getExpectedParamsForConnection({
//     app: App.TWITTER,
//     type: AuthType.PASSWORD_BASED_AUTH
// });

// console.log(params);


