import { connectionMessage, integrationMessage, toolMessage, type IToolMessage } from "./helpers/common";
import { getPublicKey } from "./helpers/getPublicKey";
import VityToolKitSDKContext from "./utils/vityToolKitContext";
import { Action, actionsMap, App, appsMap, type ConnectableApps, type IntegrableApps } from "./tools";
import type { AppAuth, AuthType, UserAuth } from "./types";
import { StorageProvider, storageProviderMap } from "../storage-providers";
import { encryptData } from "./helpers/encryption";
import logger from "./utils/logger";
import { Contract } from "../contract";
import { PublicKey } from "@solana/web3.js";
import { defaultInstance } from "./helpers/zodDefaultInstance";


export class VityToolKit {
    private readonly storageProvider: StorageProvider;

    constructor({ userPrivateKey, appPrivateKey, storageProvider }: { userPrivateKey?: string, appPrivateKey?: string, storageProvider?: StorageProvider } = {}) {
        this.storageProvider = storageProvider || StorageProvider.PINATA;
        VityToolKitSDKContext.storageProvider = this.storageProvider;

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

    getInputParamsForAction({ action }: { action: Action }) {
        const inputParams = actionsMap[action as keyof typeof actionsMap].inputParams;
        // return makeInstantiator(inputParams)({});
        return defaultInstance(inputParams);
    }

    async executeAction({ action, inputParams = {} }: { action: Action, inputParams?: object }): Promise<IToolMessage> {
        try {
            const result = await actionsMap[action as keyof typeof actionsMap].execute(inputParams);
            const resultJSON = JSON.parse(result) as IToolMessage;
            if (!resultJSON.success) {
                logger.error(`Error executing action: ${resultJSON.data}`);
                const message = toolMessage({
                    success: false,
                    data: resultJSON.data,
                });
                return JSON.parse(message) as IToolMessage;
            }
            logger.info(`Action executed successfully!`);
            return resultJSON;
        } catch (error: any) {
            logger.error(`Error executing action: ${error}}`);

            const message = toolMessage({
                success: false,
                data: error,
            });

            return JSON.parse(message) as IToolMessage;
        }
    }

    getExpectedParamsForIntegration({ app, type }: { app: IntegrableApps, type?: AuthType }) {
        return appsMap[app].getExpectedParamsForIntegration(type);
    }

    getExpectedParamsForConnection({ app, type }: { app: ConnectableApps, type: AuthType }) {
        try {
            return appsMap[app].getExpectedParamsForConnection(type);
        } catch (error) {
            throw error;
        }
    }

    async isIntegration({ app, type }: { app: IntegrableApps, type?: AuthType }) {
        // validate 
        const appPrivateKey = VityToolKitSDKContext.appPrivateKey;
        const appPublicKey = VityToolKitSDKContext.appPublicKey;
        if (!appPrivateKey) { // check if app private key is present
            logger.error("App private key is missing");
            // return integrationMessage({
            //     success: false,
            //     data: "App private key is missing",
            // });
            throw new Error("App private key is missing");
        }

        if (!appPublicKey) { // check if app public key is present
            logger.error("App public key is missing");
            // return integrationMessage({
            //     success: false,
            //     data: "App public key is missing",
            // });
            throw new Error("App public key is missing. Something might be wrong with the App private key you provided");
        }

        // get from smart contract
        const contract = new Contract(appPrivateKey);
        const dataURI = await contract.getAppAuth(app, new PublicKey(appPublicKey));
        if (!dataURI) { // check if smart contract failed to fetch data
            logger.info(`${app} app is not integrated`);
            return integrationMessage({
                success: false,
                data: "Seems like app is not integrated",
            });
        }

        return integrationMessage({
            success: true
        });
    }

    async isConnection({ app, type }: { app: ConnectableApps, type?: AuthType }) {
        // validate 
        const appPrivateKey = VityToolKitSDKContext.appPrivateKey;
        const appPublicKey = VityToolKitSDKContext.appPublicKey;
        if (!appPrivateKey) { // check if app private key is present
            logger.error("App private key is missing");
            // return integrationMessage({
            //     success: false,
            //     data: "App private key is missing",
            // });
            throw new Error("App private key is missing");
        }

        if (!appPublicKey) { // check if app public key is present
            logger.error("App public key is missing");
            // return integrationMessage({
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
            logger.info(`${app.toUpperCase()} app is not connected`);
            return integrationMessage({
                success: false,
                data: "Seems like app is not connected",
            });
        }

        return integrationMessage({
            success: true
        });
    }

    async appIntegration({ app, type, authData }: { app: IntegrableApps, type?: AuthType, authData: object }) {
        // validate
        const appPrivateKey = VityToolKitSDKContext.appPrivateKey;
        const appPublicKey = VityToolKitSDKContext.appPublicKey;
        if (!appPrivateKey) { // check if app private key is present
            logger.error("App's private key is missing");
            return integrationMessage({
                success: false,
                data: "App's private key is missing",
            });
        }

        if (!appPublicKey) { // check if app public key is present
            logger.error("App's public key is missing");
            return integrationMessage({
                success: false,
                data: "App's public key is missing",
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

        logger.info(`Successfully integrated app: ${app.toUpperCase()}`);
        return integrationMessage({
            success: true,
            data: `Successfully integrated app: ${app.toUpperCase()}`,
        });
    }

    async initiateAppConnection({ app, type, authData }: { app: ConnectableApps, type: AuthType, authData: object }) {
        // validate
        const appPrivateKey = VityToolKitSDKContext.appPrivateKey;
        const appPublicKey = VityToolKitSDKContext.appPublicKey;
        if (!appPrivateKey) { // check if app private key is present
            logger.error("App's private key is missing");
            return integrationMessage({
                success: false,
                data: "App's private key is missing",
            });
        }

        if (!appPublicKey) { // check if app public key is present
            logger.error("App's public key is missing");
            return integrationMessage({
                success: false,
                data: "App's public key is missing",
            });
        }

        const userPrivateKey = VityToolKitSDKContext.userPrivateKey;
        const userPublicKey = VityToolKitSDKContext.userPublicKey;
        if (!userPrivateKey) { // check if app private key is present
            logger.error("User's private key is missing");
            return connectionMessage({
                success: false,
                data: "User's private key is missing",
            });
        }

        if (!userPublicKey) { // check if app public key is present
            logger.error("User's public key is missing");
            return connectionMessage({
                success: false,
                data: "User's public key is missing",
            });
        }

        let params: { [key: string]: any } = {};
        try {
            params = this.getExpectedParamsForConnection({ app, type });
        } catch (error: any) {
            logger.error(`${error}`);
            return connectionMessage({
                success: false,
                data: error,
            });
        }

        const missingParams = Object.keys(params).filter(param => !(param in authData));
        if (missingParams.length > 0) { // check if all required parameters are present for requested app integration
            logger.error(`Missing required parameters: ${missingParams.join(', ')}`);
            throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
        }

        // encrypt
        // @TODO: for now we are encrypting with crypto lib but we will do it with the help of Lit Protocol in future
        const encryptedAuthData = encryptData(JSON.stringify(authData), userPrivateKey);

        // store in preferred storage provider
        const storageProvider = this.storageProvider;
        const storageProviderInstance = new storageProviderMap[storageProvider]();

        const authCID = await storageProviderInstance.store(encryptedAuthData);
        if (!authCID) { // check if storage provider failed to store data
            throw new Error("Failed to store auth data in storage provider");
        }

        // save the encrypt uri with other needed data in storage provider again
        const userAuthData: UserAuth = {
            appAddress: appPublicKey,
            authUri: authCID,
            authority: userPublicKey,
        }
        const cid = await storageProviderInstance.store(userAuthData);
        if (!cid) { // check if storage provider failed to store data
            throw new Error("Failed to store app uri in storage provider");
        }

        // save in smart contract
        const contract = new Contract(appPrivateKey);
        await contract.saveUserAuth(app, new PublicKey(appPublicKey), new PublicKey(userPublicKey), cid);

        logger.info(`Successfully connected app: ${app.toUpperCase()}`);
        return integrationMessage({
            success: true,
            data: `Successfully connected app: ${app.toUpperCase()}`,
        });
    }

}


