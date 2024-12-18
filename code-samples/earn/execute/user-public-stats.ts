import { VityToolKit, Action } from "vity-toolkit";


const toolKit = new VityToolKit();
const result = await toolKit.executeAction({ action: Action.EARN_FETCH_USER_PUBLIC_STATS, inputParams: { username: 'thatsmeadarsh' } });

console.log(result.data);