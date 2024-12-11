import { PublicKey } from "@solana/web3.js";


/**
 * Common token addresses used across the toolkit
 */
export const TOKENS = {
    USDC: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    USDT: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
    USDS: new PublicKey("USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA"),
    SOL: new PublicKey("So11111111111111111111111111111111111111112"),
    jitoSOL: new PublicKey("J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn"),
    bSOL: new PublicKey("bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1"),
    mSOL: new PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"),
    BONK: new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"),
} as const;

/**
 * Common network endpoints used across the toolkit
 */
export const NETWORKS = {
    MAINNET_BETA: "https://api.mainnet-beta.solana.com",
    DEVNET: "https://api.devnet.solana.com",
    TESTNET: "https://api.testnet.solana.com",
} as const;

