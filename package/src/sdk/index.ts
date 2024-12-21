import { integrationMessage, toolMessage, type IToolMessage } from "./helpers/common";
import { getPublicKey } from "./helpers/getPublicKey";
import VityToolKitSDKContext from "./utils/vityToolKitContext";
import { Action, actionsMap, App, appsMap, type ConnectableApps, type IntegrableApps } from "./tools";
import type { AppAuth, AuthType } from "./types";
import { StorageProvider, storageProviderMap } from "../storage-providers";
import { decryptData, encryptData } from "./helpers/encryption";
import logger from "./utils/logger";
import { Contract } from "../contract";
import { PublicKey } from "@solana/web3.js";


export class VityToolKit {
    private readonly storageProvider: StorageProvider;

    constructor({ userPrivateKey, appPrivateKey, storageProvider }: { userPrivateKey?: string, appPrivateKey?: string, storageProvider?: StorageProvider } = {}) {
        this.storageProvider = storageProvider || StorageProvider.PINATA;
        
        if (userPrivateKey) {
            VityToolKitSDKContext.userPrivateKey = userPrivateKey;
            VityToolKitSDKContext.userPublicKey = getPublicKey(userPrivateKey);
        }

        if (appPrivateKey) {
            VityToolKitSDKContext.appPrivateKey = appPrivateKey;
            VityToolKitSDKContext.appPublicKey = getPublicKey(appPrivateKey);
        }
    }

    _getApps(apps: App[]) {
        return apps.flatMap(app => new appsMap[app]().getTools());
    }

    _getActions(actions: Action[]) {
        return actions.map(action => actionsMap[action as keyof typeof actionsMap]);
    }

    async executeAction({ action, inputParams = {} }: { action: Action, inputParams?: object }): Promise<IToolMessage> {
        try {
            const result = await actionsMap[action as keyof typeof actionsMap].execute(inputParams);
            logger.info(`Executed action: ${action}`);
            return JSON.parse(result) as IToolMessage;
        } catch (error: any) {
            logger.error(`Error executing action: ${action}`, error);

            const message = toolMessage({
                success: false,
                data: error.message,
            });

            return JSON.parse(message) as IToolMessage;
        }
    }

    getExpectedParamsForIntegration({ app, type }: { app: IntegrableApps, type?: AuthType }) {
        return new appsMap[app]().getExpectedParamsForIntegration(type);
    }

    // getExpectedParamsForConnection({ app, type }: { app: ConnectableApps, type: AuthType }) {
    //     return new appsMap[app]().getExpectedParamsForConnection(type);
    // }

    async getIntegration({ app, type }: { app: IntegrableApps, type?: AuthType }) {
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
        const storageProvider = this.storageProvider;
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

    // async getConnection(app: ConnectableApps) {

    // }

    async appIntegration({ app, type, authData }: { app: IntegrableApps, type?: AuthType, authData: object }) {
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

        const params: { [key: string]: any } = this.getExpectedParamsForIntegration({ app, type });
        const missingParams = Object.keys(params).filter(param => !(param in authData));
        if (missingParams.length > 0) { // check if all required parameters are present for requested app integration
            logger.error(`Missing required parameters: ${missingParams.join(', ')}`);
            throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
        }

        // encrypt
        // @TODO: for now we are encrypting with crypto lib but we will do it with the help of Lit Protocol in future
        const encryptedAuthData = encryptData(JSON.stringify(authData), appPrivateKey);

        // store in preferred storage provider
        const storageProvider = this.storageProvider;
        const storageProviderInstance = new storageProviderMap[storageProvider]();

        const authCID = await storageProviderInstance.store(encryptedAuthData);
        if (!authCID) { // check if storage provider failed to store data
            throw new Error("Failed to store auth data in storage provider");
        }

        // save the encrypt uri with other needed data in storage provider again
        const appAuthData: AppAuth = {
            appAddress: appPublicKey,
            authUri: authCID,
        }
        const cid = await storageProviderInstance.store(appAuthData);
        if (!cid) { // check if storage provider failed to store data
            throw new Error("Failed to store app uri in storage provider");
        }

        // save in smart contract
        const contract = new Contract(appPrivateKey);
        await contract.saveAppAuth(app, cid);

        logger.info(`Successfully integrated app: ${app}`);
        return integrationMessage({
            success: true,
            data: `Successfully integrated app: ${app}`,
        });
    }

    // async initiateAppConnection({ app, authData }: { app: ConnectableApps, authData: object }) {
    //     return await new appsMap[app]().initiateAppConnection(authData);
    // }

}


