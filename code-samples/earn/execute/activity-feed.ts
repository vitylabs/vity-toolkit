import { VityToolKit, Action } from "../../../src";


const toolKit = new VityToolKit();
const result = await toolKit.executeAction({ action: Action.EARN_ACTIVITY_FEED });

console.log(result.data);