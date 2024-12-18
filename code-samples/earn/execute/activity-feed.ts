import { VityToolKit, Action } from "vity-toolkit";


const toolKit = new VityToolKit();
const result = await toolKit.executeAction({ action: Action.EARN_ACTIVITY_FEED });

console.log(result.data);