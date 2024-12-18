import { VityToolKit, Action } from "vity-toolkit";


const toolKit = new VityToolKit();
const result = await toolKit.executeAction({ action: Action.EARN_SEARCH_USERS, inputParams: { query: 'thatsmeadarsh' } });

console.log(result.data);