import * as anchor from "@project-serum/anchor";
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

        const programId = new PublicKey("HfxL7uHx6cHVHox4Fy6aMio4zKyPmgH2FGsRUgehgF1r");
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        const provider = new anchor.AnchorProvider(
            connection,
            this.wallet,
            {}
        )
        this.program = new anchor.Program(idl as unknown as anchor.Idl, programId, provider);
    }

    async saveAppAuth(appName: string, uri: string) {
        try {
            await this.program.methods.saveAppAuth(appName, uri).accounts({
                signer: this.wallet.publicKey,
                appAuth: this.getAppPDAAddress(appName, this.wallet.publicKey),
                systemProgram: anchor.web3.SystemProgram.programId,
            }).rpc();
        } catch (error) {
            logger.error("Error saving app auth :: ", error);
            throw error;
        }
    }

    async saveUserAuth(appAddress: PublicKey, appName: string, uri: string) {
        try {
            await this.program.methods.saveUserAuth(appName, uri).accounts({
                signer: this.wallet.publicKey,
                userAuth: this.getUserPDAAddress(appName, appAddress),
                systemProgram: anchor.web3.SystemProgram.programId,
            }).rpc();
        } catch (error) {
            logger.error("Error saving user auth :: ", error);
            throw error;
        }
    }

    async getAppAuth(appName: string, appAddress: PublicKey): Promise<string> {
        const pdaAddress = this.getAppPDAAddress(appName, appAddress);
        try {
            let authDetails = await this.program.account.appAuth.fetch(pdaAddress);
            return authDetails.uri;
        } catch (error) {
            logger.error("Error fetching the auth :: ", error);
            throw error;
        }
    }

    async getUserAuth(appName: string, userAddress: PublicKey): Promise<string> {
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
            return authDetails.uri;
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


