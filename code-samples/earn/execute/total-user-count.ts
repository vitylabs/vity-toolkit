import { VityToolKit, Action } from "vity-toolkit";


const toolKit = new VityToolKit();
const result = await toolKit.executeAction({ action: Action.EARN_TOTAL_USER_COUNT });

console.log(result.data);