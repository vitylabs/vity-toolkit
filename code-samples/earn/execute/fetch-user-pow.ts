import { VityToolKit, Action } from "vity-toolkit";


const toolKit = new VityToolKit();

// 1. Get expected params for an action
const expectedParams = toolKit.getInputParamsForAction({ action: Action.EARN_FETCH_USER_POWS });
console.log(expectedParams);

// 2. Get expected params for executing the action
const params = { userId: '1ce11bfa-7fca-4d0f-9d19-c114b18a0207' };

const result = await toolKit.executeAction({ action: Action.EARN_FETCH_USER_POWS, inputParams: params });

console.log(result.data);