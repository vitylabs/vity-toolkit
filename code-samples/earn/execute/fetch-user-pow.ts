import { VityToolKit, Action } from "../../../src";


const toolKit = new VityToolKit();
const result = await toolKit.executeAction({ action: Action.EARN_FETCH_USER_POWS, inputParams: { userId: '1ce11bfa-7fca-4d0f-9d19-c114b18a0207' } });

console.log(result.data);