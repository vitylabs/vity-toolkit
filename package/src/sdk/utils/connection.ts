import { PublicKey } from "@solana/web3.js";
import { Contract } from "../../contract";
import { connectionMessage } from "../helpers/common";
import type { ConnectableApps } from "../tools";
import type { AuthType } from "../types";
import logger from "./logger";
import VityToolKitSDKContext from "./vityToolKitContext";
import { StorageProvider, storageProviderMap } from "../../storage-providers";
import { decryptData } from "../helpers/encryption";


export class Connection {

    async getConnection({ app, type }: { app: ConnectableApps, type?: AuthType }) {
        const storageProvider = VityToolKitSDKContext.storageProvider || StorageProvider.PINATA;

        // validate 
        const appPrivateKey = VityToolKitSDKContext.appPrivateKey;
        const appPublicKey = VityToolKitSDKContext.appPublicKey;
        if (!appPrivateKey) { // check if app private key is present
            logger.error("App private key is missing");
            // return connectionMessage({
            //     success: false,
            //     data: "App private key is missing",
            // });
            throw new Error("App private key is missing");
        }

        if (!appPublicKey) { // check if app public key is present
            logger.error("App public key is missing");
            // return connectionMessage({
            //     success: false,
            //     data: "App public key is missing",
            // });
            throw new Error("App public key is missing. Something might be wrong with the App private key you provided");
        }

        const userPrivateKey = VityToolKitSDKContext.userPrivateKey;
        const userPublicKey = VityToolKitSDKContext.userPublicKey;
        if (!userPrivateKey) { // check if app private key is present
            logger.error("User's private key is missing");
            // return connectionMessage({
            //     success: false,
            //     data: "User's private key is missing",
            // });
            throw new Error("User's private key is missing");
        }

        if (!userPublicKey) { // check if app public key is present
            logger.error("User's public key is missing");
            // return connectionMessage({
            //     success: false,
            //     data: "User's public key is missing",
            // });
            throw new Error("User's public key is missing. Something might be wrong with the User's private key you provided");
        }

        // get from smart contract
        const contract = new Contract(appPrivateKey);
        const dataURI = await contract.getUserAuth(app, new PublicKey(appPublicKey), new PublicKey(userPublicKey));
        if (!dataURI) { // check if smart contract failed to fetch data
            throw new Error("Failed to fetch app uri from smart contract");
        }

        // get from storage provider (data object)
        const storageProviderInstance = new storageProviderMap[storageProvider]();
        const authData = await storageProviderInstance.retrieve(dataURI);

        // get from storage provider (auth data - env variables)
        const authCID = (authData as { authUri: string }).authUri;
        const encryptedAuthData = await storageProviderInstance.retrieve(authCID);
        if (!encryptedAuthData) { // check if storage provider failed to fetch data
            throw new Error("Failed to fetch auth data from storage provider");
        }

        // decrypt auth data
        const { iv, authTag, ciphertext } = encryptedAuthData as { iv: string; authTag: string; ciphertext: string };
        const decryptedAuthData = decryptData({ iv, authTag, ciphertext }, appPrivateKey);
        if (!decryptedAuthData) { // check if decryption failed
            throw new Error("Failed to decrypt auth data");
        }
        const decryptedAuthDataObject = JSON.parse(decryptedAuthData);


        logger.info(`Successfully fetched connection details for app: ${app.toUpperCase()}`);
        return connectionMessage({
            success: true,
            data: decryptedAuthDataObject,
        });

    }

}



