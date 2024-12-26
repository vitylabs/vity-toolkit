import { VityToolKit, Action } from "vity-toolkit";


const toolKit = new VityToolKit();

const result = await toolKit.executeAction({ action: Action.GIBWORK_EXPLORE });
console.log(result.data);