import { VityToolKit, Action } from 'vity-toolkit';


const toolKit = new VityToolKit({
    userPrivateKey: "3C82AFmHn64h2gYGQbPHFrQB9bJzT5hfSGXuTwpf9RCX59yvusZd5DhVMmq9AYbgRNooGqdY2D2oJqvPAX8CLnGv"
});

const result = await toolKit.executeAction({ 
    action: Action.TWITTER_CREATE_TWEET, 
    inputParams: {
        statusOrPayload: "Hello world"
    }
});

console.log(result.data);



