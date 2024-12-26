import { VityToolKit, Action } from "vity-toolkit";


const toolKit = new VityToolKit();

// 1. Get expected params for an action
// const expectedParams = toolKit.getInputParamsForAction({ action: Action.GIBWORK_TASKS });
// console.log(expectedParams);

// 2. Get expected params for executing the action
const params = {
    id: "49dd3d37-1184-4ae6-b1ab-70b50a208a93",
}

const result = await toolKit.executeAction({ action: Action.GIBWORK_TASKS, inputParams: params });
console.log(result.data);