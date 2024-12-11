import { solanaWalletTools } from "./solana-wallet";
import { solanaWalletGenerateKeypairTool } from "./solana-wallet/actions/generate-keypair";
import { solanaWalletGetBalanceTool } from "./solana-wallet/actions/get-balance";
import { solanaWalletGetMyPublicKeyTool } from "./solana-wallet/actions/get-my-publicKey";
import { solanaWalletTransferTool } from "./solana-wallet/actions/transfer";


export enum App {
    SOLANA_WALLET,
}

export const appsMap = {
    [App.SOLANA_WALLET]: solanaWalletTools,
}


export enum Action {
    SOLANA_WALLET_GENERATE_KEYPAIR,
    SOLANA_WALLET_GET_BALANCE,
    SOLANA_WALLET_GET_MY_PUBLIC_KEY,
    SOLANA_WALLET_TRANSFER,
}

export const actionsMap = {
    [Action.SOLANA_WALLET_GENERATE_KEYPAIR]: solanaWalletGenerateKeypairTool,
    [Action.SOLANA_WALLET_GET_BALANCE]: solanaWalletGetBalanceTool,
    [Action.SOLANA_WALLET_GET_MY_PUBLIC_KEY]: solanaWalletGetMyPublicKeyTool,
    [Action.SOLANA_WALLET_TRANSFER]: solanaWalletTransferTool,
}


