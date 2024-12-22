import { PublicKey } from "@solana/web3.js";
import { Contract } from "../../contract";
import { integrationMessage } from "../helpers/common";
import type { IntegrableApps } from "../tools";
import type { AuthType } from "../types";
import logger from "./logger";
import VityToolKitSDKContext from "./vityToolKitContext";
import { StorageProvider, storageProviderMap } from "../../storage-providers";
import { decryptData } from "../helpers/encryption";


export class Integration {

    async getIntegration({ app, type }: { app: IntegrableApps, type?: AuthType }) {
        const storageProvider = VityToolKitSDKContext.storageProvider || StorageProvider.PINATA;

        // validate 
        const appPrivateKey = VityToolKitSDKContext.appPrivateKey;
        const appPublicKey = VityToolKitSDKContext.appPublicKey;
        if (!appPrivateKey) { // check if app private key is present
            logger.error("App private key is missing");
            return integrationMessage({
                success: false,
                data: "App private key is missing",
            });
        }

        if (!appPublicKey) { // check if app public key is present
            logger.error("App public key is missing");
            return integrationMessage({
                success: false,
                data: "App public key is missing",
            });
        }

        // get from smart contract
        const contract = new Contract(appPrivateKey);
        const dataURI = await contract.getAppAuth(app, new PublicKey(appPublicKey));
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


        logger.info(`Successfully fetched integration details for app: ${app}`);
        return integrationMessage({
            success: true,
            data: decryptedAuthDataObject,
        });

    }

}



