import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { z } from "zod";

import { makeAxiosRequest } from "../common";
import logger from "../../../utils/logger";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import VityToolKitSDKContext from "../../../utils/vityToolKitContext";
import { getKeypair } from "../../../helpers/getPublicKey";
import { NETWORKS } from "../../../constants";

const METHOD = 'POST';
const URL_TEMPLATE = '/tasks/public/transaction';


const gibworkCreateTask = async (inputParams: { title: string, content: string, requirements: string, tags: string[], tokenMintAddress: string, amount: number }) => {

    try {
        const privateKey = VityToolKitSDKContext.userPrivateKey;
        const publicKey = VityToolKitSDKContext.userPublicKey;

        // validation
        if (!privateKey || !publicKey) {
            return toolMessage({
                success: false,
                data: {
                    error: "No user private key found. Pass the user private key in the VityToolKit constructor.",
                },
            });
        }

        const responseData = await makeAxiosRequest(
            METHOD,
            URL_TEMPLATE,
            JSON.stringify({
                title: inputParams.title,
                content: inputParams.content,
                requirements: inputParams.requirements,
                tags: inputParams.tags,
                payer: publicKey,
                token: {
                    mintAddress: inputParams.tokenMintAddress,
                    amount: inputParams.amount,
                },
            })
        );
        console.log(responseData);

        if (!responseData.taskId && !responseData.serializedTransaction) {
            return toolMessage({
                success: false,
                data: {
                    error: "Error occurred while creating the task",
                },
            });
        }

        const serializedTransaction = Buffer.from(
            responseData.serializedTransaction,
            "base64",
        );
        const tx = VersionedTransaction.deserialize(serializedTransaction);
        console.log(tx);

        const signer = getKeypair(privateKey);
        tx.sign([signer]);

        const connection = new Connection(NETWORKS.MAINNET_BETA);
        const signature = await connection.sendTransaction(tx, {
            preflightCommitment: "confirmed",
            maxRetries: 3,
        });
        console.log("Your transaction signature", signature);

        const latestBlockhash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });

        const response = {
            taskId: responseData.taskId,
            signature,
        }

        return toolMessage({
            success: true,
            data: response,
        });
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error occurred while creating the task: ${error.message}`);
            return toolMessage({
                success: false,
                data: `Error occurred while creating the task: ${error.message}`,
            });
        } else {
            logger.error(`Error occurred while creating the task: ${String(error)}`);
            return toolMessage({
                success: false,
                data: `Error occurred while creating the task: ${error}`,
            });
        }
    }
};

export const gibworkCreateTaskTool = createAction({
    name: "gibworkCreateTaskTool",
    description: `Creates a task and returns a serialized transaction to fund the task on the gibwork platform`,
    inputParams: z.object({
        title: z.string().min(1).describe('Title of the task'),
        content: z.string().min(1).describe('Description of the task'),
        requirements: z.string().min(1).describe('Requirements to complete the task'),
        tags: z.array(z.string()).min(1).describe('List of tags associated with the task'),
        tokenMintAddress: z.string().min(1).describe('Token mint address for payment'),
        amount: z.number().min(0).describe('Payment amount for the task'),
    }),
    execute: gibworkCreateTask,
});