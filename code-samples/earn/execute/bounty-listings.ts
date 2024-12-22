import { LangchainToolkit, Action } from "vity-toolkit";


const toolKit = new LangchainToolkit();
const result = await toolKit.executeAction({ action: Action.EARN_BOUNTY_LISTINGS });

console.log(result.data);