import * as anchor from "@project-serum/anchor";
import type { Contract as IDL } from "./idl";
import idl from "./idl.json";
import { clusterApiUrl, Connection, PublicKey, type Keypair } from "@solana/web3.js";
import { getKeypair } from "../sdk/helpers/getPublicKey";
import logger from "../sdk/utils/logger";


export class Contract {
    private readonly solanaKeypair: Keypair;
    private readonly wallet: anchor.Wallet;
    private readonly program: anchor.Program;

    constructor(solanaPrivateKey: string) {
        this.solanaKeypair = getKeypair(solanaPrivateKey);
        this.wallet = new anchor.Wallet(this.solanaKeypair);

        const programId = new PublicKey("AEqfthAnEGQ27vp6Dy9nDzZPJL1wcicbGeiLcWnptn3N");
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        const provider = new anchor.AnchorProvider(
            connection,
            this.wallet,
            {}
        )
        this.program = new anchor.Program(idl as unknown as anchor.Idl, programId, provider);

        logger.info("Contract initialized");
    }

    async saveAppAuth(appName: string, authURI: string) {
        try {
            await this.program.methods.saveAppAuth(appName, authURI).accounts({
                signer: this.wallet.publicKey,
                app_auth: this.getAppPDAAddress(appName, this.wallet.publicKey),
                system_program: anchor.web3.SystemProgram.programId,
            }).rpc();
            const details = await this.getAppAuth(appName, this.wallet.publicKey);
            console.log(details);
        } catch (error) {
            logger.error("Error saving app auth :: ", error);
            throw error;
        }
    }

    async saveUserAuth(appAddress: PublicKey, appName: string, authURI: string) {
        try {
            await this.program.methods.saveUserAuth(appName, appAddress, authURI).accounts({
                signer: this.wallet.publicKey,
                user_auth: this.getUserPDAAddress(appName, appAddress),
                system_program: anchor.web3.SystemProgram.programId,
            }).rpc();
            const details = await this.getUserAuth(appName, appAddress);
            console.log(details);
        } catch (error) {
            logger.error("Error saving user auth :: ", error);
            throw error;
        }
    }

    async getAppAuth(appName: string, appAddress: PublicKey) {
        const pdaAddress = this.getAppPDAAddress(appName, appAddress);
        try {
            let authDetails = await this.program.account.appAuth.fetch(pdaAddress);
            return authDetails;
        } catch (error) {
            logger.error("Error fetching the auth :: ", error);
            throw error;
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
            throw error;
        }
    }

    private getAppPDAAddress(appName: string, appAddress: PublicKey) {
        const [pdaAddress, _] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from(appName),
                anchor.utils.bytes.utf8.encode('app-auth'),
                appAddress.toBuffer(),
            ],
            this.program.programId
        )

        return pdaAddress;
    }

    private getUserPDAAddress(appName: string, userAddress: PublicKey) {
        const [pdaAddress, _] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from(appName),
                anchor.utils.bytes.utf8.encode('user-auth'),
                userAddress.toBuffer(),
            ],
            this.program.programId
        )

        return pdaAddress;
    }

}


