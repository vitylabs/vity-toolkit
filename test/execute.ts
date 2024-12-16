import { VityToolKit } from "../src";
import { Action } from "../src/sdk/tools";


const toolKit = new VityToolKit();

const result = await toolKit.executeAction({ action: Action.TWITTER_GET_USER_BY_USERNAME, inputParams: { username: "thatsmeadarsh" } });
console.log(result.data);



