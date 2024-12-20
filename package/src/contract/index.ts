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

    async saveUserAuth(appAddress: PublicKey, appName: string, authURI: string) {
        await this.program.methods.saveUserAuth(appName, appAddress, authURI).rpc();
    }

    async getAppAuth(appName: string, appAddress: PublicKey) {
        const [pdaAddress, _] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from(appName),
                anchor.utils.bytes.utf8.encode('app-auth'),
                appAddress.toBuffer(),
            ],
            this.program.programId
        )
        try {
            let authDetails = await this.program.account.appAuth.fetch(pdaAddress);
            return authDetails;
        } catch (error) {
            logger.error("Error fetching the auth :: ", error);
        }
    }

    async getUserAuth(appName: string, userAddress: PublicKey) {
        const [pdaAddress, _] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from(appName),
                anchor.utils.bytes.utf8.encode('user-auth'),
                userAddress.toBuffer(),
            ],
            this.program.programId
        )
        try {
            let authDetails = await this.program.account.userAuth.fetch(pdaAddress);
            return authDetails;
        } catch (error) {
            logger.error("Error fetching the auth :: ", error);
        }
    }

}


