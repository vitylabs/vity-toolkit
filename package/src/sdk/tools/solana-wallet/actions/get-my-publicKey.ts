import { z } from "zod";
import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import VityToolKitSDKContext from "../../../utils/vityToolKitContext";


export const solanaWalletGetMyPublicKey = async (): Promise<string> => {
    if (!VityToolKitSDKContext) {
        throw new Error('VityToolKit not initialized');
    }
    
    const publicKey = VityToolKitSDKContext.userPublicKey;
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

export const solanaWalletGetMyPublicKeyTool = createAction({
    name: "solanaWalletGetMyPublicKeyTool",
    description: "Get the public key of the current user",
    inputParams: z.object({}),
    execute: solanaWalletGetMyPublicKey,
});


