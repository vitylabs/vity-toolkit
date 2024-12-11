import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";


export function getPublicKey(privateKey: string): string {
    const wallet = Keypair.fromSecretKey(bs58.decode(privateKey));
    return wallet.publicKey.toBase58();
}

export function getKeypair (privateKey: string): Keypair {
    return Keypair.fromSecretKey(bs58.decode(privateKey));
}



