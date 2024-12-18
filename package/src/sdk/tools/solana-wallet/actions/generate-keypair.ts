import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { Keypair } from "@solana/web3.js"
import bs58 from "bs58";


const solanaWalletGenerateKeypair = async (): Promise<string> => {
    const wallet = Keypair.generate();

    return toolMessage({
        success: true,
        data: {
            publicKey: wallet.publicKey.toBase58(),
            privateKey: bs58.encode(wallet.secretKey),
            secretKey: wallet.secretKey.toString(),
        },
    });
}


export const solanaWalletGenerateKeypairTool = createAction({
    name: "solanaWalletGenerateKeypairTool",
    description: "Generate a new Solana keypair",
    inputParams: z.object({}),
    execute: solanaWalletGenerateKeypair,
});


