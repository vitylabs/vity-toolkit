import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import type { Contract } from "./idl";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";


export const programId = new PublicKey("AEqfthAnEGQ27vp6Dy9nDzZPJL1wcicbGeiLcWnptn3N");
export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const program = anchor.workspace.Contract as Program<Contract>;
export const provider = new anchor.AnchorProvider(
    connection,
    anchor.Wallet.local(),
    {
        commitment: "confirmed",
    }
)
