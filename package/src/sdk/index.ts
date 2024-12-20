import { integrationMessage, toolMessage, type IToolMessage } from "./helpers/common";
import { getPublicKey } from "./helpers/getPublicKey";
import VityToolKitSDKContext from "./utils/vityToolKitContext";
import { Action, actionsMap, App, appsMap, type ConnectableApps, type IntegrableApps } from "./tools";
import type { AuthType } from "./types";
import { StorageProvider, storageProviderMap } from "../storage-providers";
import { encryptData } from "./helpers/encryption";
import logger from "./utils/logger";


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

    // async getIntegration(app: IntegrableApps) {

    // }

    // async getConnection(app: ConnectableApps) {

    // }

    async appIntegration({ app, type, authData }: { app: IntegrableApps, type?: AuthType, authData: object }) {
        // validate
        const appPrivateKey = VityToolKitSDKContext.appPrivateKey;
        if (!appPrivateKey) { // check if app private key is present
            logger.error("App private key is missing");
            return integrationMessage({
                success: false,
                data: "App private key is missing",
            });
        }

        const params: { [key: string]: any } = this.getExpectedParamsForIntegration({ app, type });
        const missingParams = Object.keys(params).filter(param => !(param in authData));
        if (missingParams.length > 0) { // check if all required parameters are present for requested app integration
            logger.error(`Missing required parameters: ${missingParams.join(', ')}`);
            return integrationMessage({
                success: false,
                data: `Missing required parameters: ${missingParams.join(', ')}`,
            });
        }

        // encrypt
        // @TODO: for now we are encrypting with crypto lib but we will do it with the help of Lit Protocol in future
        const encryptedAuthData = encryptData(JSON.stringify(authData), appPrivateKey);

        // store in preferred storage provider
        const storageProvider = this.storageProvider;
        const storageProviderInstance = new storageProviderMap[storageProvider]();

        const cid = await storageProviderInstance.store(encryptedAuthData);

        // save in smart contract
        
    }

    // async initiateAppConnection({ app, authData }: { app: ConnectableApps, authData: object }) {
    //     return await new appsMap[app]().initiateAppConnection(authData);
    // }

}


