import { createAction } from "../../../helpers/createAction";
import { toolMessage } from "../../../helpers/common";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { z } from "zod";
import { getNetworkEndpoint, getTokenddress } from "../../../helpers/token";


const solanaWalletGetBalance = async (inputParams: { publicKey: string, tokenName?: string, rpc?: string, network?: string }) => {
    let connection: Connection;
    const pubKey: PublicKey = new PublicKey(inputParams.publicKey);

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

        // Fetch token accounts owned by the public key
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            pubKey,
            { mint: new PublicKey(tokenAddress) }
        );

        // Extract and sum the balances
        const balances = tokenAccounts.value.map(
            (accountInfo) => accountInfo.account.data.parsed.info.tokenAmount.uiAmount
        );
        const totalBalance = balances.reduce((sum, balance) => sum + (balance || 0), 0);

        return toolMessage({
            success: true,
            data: {
                totalBalance,
            },
        });
    }

    // Fetch SOL balance
    const balance = await connection.getBalance(pubKey) / LAMPORTS_PER_SOL;

    return toolMessage({
        success: true,
        data: {
            balance,
        },
    });
}


export const solanaWalletGetBalanceTool = createAction({
    name: "solanaWalletGetBalanceTool",
    description: "Retrieve the balance of a Solana account.",
    inputParams: z.object({
        publicKey: z.string().describe("The public key of the Solana account."),
        tokenName: z.string().optional().describe("The token name to get the balance of, e.g. USDC, USDT, USDS, SOL, jitoSOL, bSOL, mSOL, BONK").default("SOL"),
        rpc: z.string().optional().describe("The custom RPC endpoint to use (other than mainnet-beta, devnet, testnet)"),
        network: z.string().optional().describe("The network to use, e.g. mainnet-beta, devnet, testnet").default("mainnet-beta"),
    }),
    execute: solanaWalletGetBalance,
});





