import type { PublicKey } from "@solana/web3.js";
import { NETWORKS, TOKENS } from "../constants";


export function getTokenddress(tokenName: string): PublicKey {
    switch (tokenName) {
        case "USDC":
            return TOKENS.USDC;
        case "USDT":
            return TOKENS.USDT;
        case "USDS":
            return TOKENS.USDS;
        case "SOL":
            return TOKENS.SOL;
        case "jitoSOL":
            return TOKENS.jitoSOL;
        case "bSOL":
            return TOKENS.bSOL;
        case "mSOL":
            return TOKENS.mSOL;
        case "BONK":
            return TOKENS.BONK;
        default:
            throw new Error(`Token ${tokenName} not found`);
    }
}

export function getNetworkEndpoint(network: string): string {
    switch (network) {
        case "mainnet-beta":
            return NETWORKS.MAINNET_BETA;
        case "devnet":
            return NETWORKS.DEVNET;
        case "testnet":
            return NETWORKS.TESTNET;
        default:
            throw new Error(`Network ${network} not found`);
    }
}


