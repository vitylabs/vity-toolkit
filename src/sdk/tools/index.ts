import { SolanaWalletTool } from "./solana-wallet";
import { solanaWalletGenerateKeypairTool } from "./solana-wallet/actions/generate-keypair";
import { solanaWalletGetBalanceTool } from "./solana-wallet/actions/get-balance";
import { solanaWalletGetMyPublicKeyTool } from "./solana-wallet/actions/get-my-publicKey";
import { solanaWalletTransferTool } from "./solana-wallet/actions/transfer";
import { TwitterTool } from "./twitter";


//  A P P S

export enum App {
    SOLANA_WALLET,
    TWITTER
}

export const appsMap = {
    [App.SOLANA_WALLET]: new SolanaWalletTool(),
    [App.TWITTER]: new TwitterTool(),
}

// Integrable apps

export type IntegrableApps = Extract<
    App,
    App.TWITTER
>;

// Connectable apps

export type ConnectableApps = Extract<
    App,
    App.TWITTER
>;


// A C T I O N S

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


