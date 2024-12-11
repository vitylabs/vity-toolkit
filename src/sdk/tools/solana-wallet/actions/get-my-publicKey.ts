import { z } from "zod";
import { createTool } from "../../../helpers/createTool";
import { toolMessage } from "../../../helpers/common";
import VityToolKitSDKContext from "../../../utils/vityToolKitContext";


export const solanaWalletGetMyPublicKey = async (): Promise<string> => {
    const publicKey = VityToolKitSDKContext.publicKey;
    if (!publicKey) {
        return toolMessage({
            success: false,
            data: {
                error: "No public key found",
            },
        });
    }

    return toolMessage({
        success: true,
        data: {
            publicKey: publicKey,
        },
    });
}

export const solanaWalletGetMyPublicKeyTool = createTool({
    name: "solanaWalletGetMyPublicKeyTool",
    description: "Retrieve the balance of a Solana account.",
    inputParams: z.object({}),
    execute: solanaWalletGetMyPublicKey,
});


