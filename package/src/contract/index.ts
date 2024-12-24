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

        const programId = new PublicKey("2JejYyTN14BgXzRHNxaTcLAZ4gxRP6G8GxC7aB2p4Nr6");
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

    async saveUserAuth(appName: string, appAddress: PublicKey, userAddress: PublicKey, uri: string) {
        try {
            await this.program.methods.saveUserAuth(appName, appAddress, uri).accounts({
                signer: this.wallet.publicKey,
                userAuth: this.getUserPDAAddress(appName, appAddress, userAddress),
                systemProgram: anchor.web3.SystemProgram.programId,
            }).rpc();
        } catch (error) {
            logger.error("Error saving user auth :: ", error);
            throw error;
        }
    }

    async getAppAuth(appName: string, appAddress: PublicKey): Promise<string | null> {
        const pdaAddress = this.getAppPDAAddress(appName, appAddress);
        try {
            let authDetails = await this.program.account.appAuth.fetch(pdaAddress);
            return authDetails.uri;
        } catch (error) {
            logger.debug("Error fetching the auth :: ", error);
            return null;
        }
    }

    async getUserAuth(appName: string, appAddress: PublicKey, userAddress: PublicKey): Promise<string | null> {
        const pdaAddress = this.getUserPDAAddress(appName, appAddress, userAddress);
        try {
            let authDetails = await this.program.account.userAuth.fetch(pdaAddress);
            return authDetails.uri;
        } catch (error) {
            logger.debug("Error fetching the auth :: ", error);
            return null;
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

    private getUserPDAAddress(appName: string, appAddress: PublicKey, userAddress: PublicKey) {
        const [pdaAddress, _] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from(appName),
                anchor.utils.bytes.utf8.encode('user-auth'),
                appAddress.toBuffer(),
                userAddress.toBuffer(),
            ],
            this.program.programId
        )

        return pdaAddress;
    }

}


