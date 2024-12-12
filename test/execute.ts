import { VityToolKit } from "../src";
import { Action } from "../src/sdk/tools";


const toolKit = new VityToolKit();

const result = await toolKit.executeAction({ action: Action.SOLANA_WALLET_GENERATE_KEYPAIR });
console.log(result.data);



