import { VityToolKit, Action } from "../../../src";


const toolKit = new VityToolKit();
const result = await toolKit.executeAction({ action: Action.EARN_FETCH_FEED_ITEM });

console.log(result.data);