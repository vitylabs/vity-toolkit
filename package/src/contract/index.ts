import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import type { Contract as IDL } from "./idl";
import { clusterApiUrl, Connection, PublicKey, type Keypair } from "@solana/web3.js";
import { getKeypair } from "../sdk/helpers/getPublicKey";
import logger from "../sdk/utils/logger";


export class Contract {
    private readonly solanaSigner: Keypair;
    private readonly provider: anchor.AnchorProvider;
    private readonly program: Program<IDL>;

    constructor(solanaPrivateKey: string) {
        this.solanaSigner = getKeypair(solanaPrivateKey);
        const wallet = new anchor.Wallet(this.solanaSigner);

        const programId = new PublicKey("AEqfthAnEGQ27vp6Dy9nDzZPJL1wcicbGeiLcWnptn3N");
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        this.program = anchor.workspace.Contract as Program<IDL>;
        this.provider = new anchor.AnchorProvider(
            connection,
            wallet,
            {
                commitment: "confirmed",
            }
        )
    }

    async saveAppAuth(appName: string, authURI: string) {
        await this.program.methods.saveAppAuth(appName, authURI).rpc();
    }

    async saveUserAuth(appId: PublicKey, appName: string, authURI: string) {
        await this.program.methods.saveUserAuth(appId, appName, authURI).rpc();
    }

}


