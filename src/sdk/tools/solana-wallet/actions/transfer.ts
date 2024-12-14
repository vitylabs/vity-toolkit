import { Connection, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { toolMessage } from "../../../helpers/common";
import VityToolKitSDKContext from "../../../utils/vityToolKitContext";
import { getNetworkEndpoint, getTokenddress } from "../../../helpers/token";
import { createTransferInstruction, getAssociatedTokenAddress, getMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, transferChecked } from "@solana/spl-token";
import { getKeypair } from "../../../helpers/getPublicKey";
import { createAction } from "../../../helpers/createTool";
import { z } from "zod";


const solanaWalletTransfer = async (inputParams: { to: string, amount: number, tokenName?: string, rpc?: string, network?: string }) => {
    try {
        let connection: Connection;
        let tx: string;

        const privateKey = VityToolKitSDKContext.userPrivateKey;
        const publicKey = VityToolKitSDKContext.userPublicKey;

        // validation
        if (!privateKey || !publicKey) {
            return toolMessage({
                success: false,
                data: {
                    error: "No private key found. Pass the private key in the VityToolKit constructor.",
                },
            });
        }

        // Use the network endpoint
        if (inputParams.network) {
            const network = getNetworkEndpoint(inputParams.network);
            if (!network) {
                return toolMessage({
                    success: false,
                    data: {
                        error: `Network ${inputParams.network} not found`,
                    },
                });
            }

            connection = new Connection(network);
        } else {
            connection = new Connection(inputParams.rpc!);
        }

        if (inputParams.tokenName && inputParams.tokenName !== "SOL") {

            // Use the token address
            const tokenAddress = getTokenddress(inputParams.tokenName);
            if (!tokenAddress) {
                return toolMessage({
                    success: false,
                    data: {
                        error: `Token ${inputParams.tokenName} not found`,
                    },
                });
            }

            // sender keypair
            const senderKeypair = getKeypair(privateKey);

            const from = new PublicKey(publicKey);
            const to = new PublicKey(inputParams.to);

            // Get the token account of the fromWallet Solana address, if it does not exist, create it
            const fromAta = await getOrCreateAssociatedTokenAccount(
                connection,
                senderKeypair,
                tokenAddress,
                from
            );

            // Get the token account of the toWallet Solana address, if it does not exist, create it
            const toAta = await getOrCreateAssociatedTokenAccount(
                connection,
                senderKeypair,
                tokenAddress,
                to
            );

            // Get mint info to determine decimals
            const mintInfo = await getMint(connection, tokenAddress);
            const adjustedAmount = inputParams.amount * Math.pow(10, mintInfo.decimals);

            const transaction = new Transaction().add(
                createTransferInstruction(
                    fromAta.address,
                    toAta.address,
                    from,
                    adjustedAmount
                )
            );

            tx = await connection.sendTransaction(transaction, [senderKeypair]);
        } else {
            // Transfer native SOL
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(publicKey),
                    toPubkey: new PublicKey(inputParams.to),
                    lamports: inputParams.amount * LAMPORTS_PER_SOL
                })
            );

            const signers = getKeypair(privateKey);

            tx = await connection.sendTransaction(transaction, [signers]);
        }

        return toolMessage({
            success: true,
            data: {
                tx,
            },
        });
    } catch (error: any) {
        return toolMessage({
            success: false,
            data: {
                error: `Transfer failed: ${error}`,
            },
        });
    }
}


export const solanaWalletTransferTool = createAction({
    name: "solanaWalletTransferTool",
    description: "Transfer Solana tokens to another account.",
    inputParams: z.object({
        to: z.string().describe("The public key of the recipient."),
        amount: z.number().describe("The amount to transfer."),
        tokenName: z.string().optional().describe("The token name to transfer, e.g. USDC, USDT, USDS, SOL, jitoSOL, bSOL, mSOL, BONK").default("SOL"),
        rpc: z.string().optional().describe("The RPC endpoint."),
        network: z.string().optional().describe("The network."),
    }),
    execute: solanaWalletTransfer,
});


