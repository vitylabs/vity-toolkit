import { VityToolKit, Action } from 'vity-toolkit';


const toolKit = new VityToolKit({
    userPrivateKey: process.env.DEMO_SOLANA_PRIVATE_KEY
});

const result = await toolKit.executeAction({ 
    action: Action.TWITTER_CREATE_TWEET, 
    inputParams: {
        statusOrPayload: "Hello world"
    }
});

console.log(result.data);



