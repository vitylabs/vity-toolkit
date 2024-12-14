import { solanaWalletGenerateKeypairTool } from "./actions/generate-keypair";
import { solanaWalletGetBalanceTool } from "./actions/get-balance";
import { solanaWalletGetMyPublicKeyTool } from "./actions/get-my-publicKey";
import { solanaWalletTransferTool } from "./actions/transfer";


export class SolanaWalletTool {

    constructor() {
    }

    getTools() {
        return [
            solanaWalletGenerateKeypairTool,
            solanaWalletGetBalanceTool,
            solanaWalletGetMyPublicKeyTool,
            solanaWalletTransferTool,
        ]
    }

}


