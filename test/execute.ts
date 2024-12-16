import { VityToolKit } from "../src";
import { Action } from "../src/sdk/tools";


const toolKit = new VityToolKit();

const result = await toolKit.executeAction({ 
    action: Action.TWITTER_CREATE_TWEET, 
    inputParams: {
        statusOrPayload: "Hello world"
    }
});
console.log(result.data);



