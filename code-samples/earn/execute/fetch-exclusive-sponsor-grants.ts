import { VityToolKit, Action } from "../../../src";


const toolKit = new VityToolKit();
const result = await toolKit.executeAction({ action: Action.EARN_FETCH_EXCLUSIVE_SPONSOR_GRANTS, inputParams: { sponsor: 'jup' } });

console.log(result.data);