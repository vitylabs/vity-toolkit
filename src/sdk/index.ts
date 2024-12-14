import { toolMessage, type IToolMessage } from "./helpers/common";
import { getPublicKey } from "./helpers/getPublicKey";
import VityToolKitSDKContext from "./utils/vityToolKitContext";
import { Action, actionsMap, App, appsMap, type ConnectableApps, type IntegrableApps } from "./tools";
import type { AuthType } from "./types";


export class VityToolKit {

    constructor({ userPrivateKey, appPrivateKey }: { userPrivateKey?: string, appPrivateKey?: string } = {}) {
        if (userPrivateKey) {
            VityToolKitSDKContext.userPrivateKey = userPrivateKey;
            VityToolKitSDKContext.userPublicKey = getPublicKey(userPrivateKey);
        }

        if (appPrivateKey) {
            VityToolKitSDKContext.appPrivateKey = appPrivateKey;
            VityToolKitSDKContext.appPublicKey = getPublicKey(appPrivateKey);
        }
    }

    private getApps(apps: App[]) {
        return apps.flatMap(app => new appsMap[app]().getTools());
    }

    private getActions(actions: Action[]) {
        return actions.map(action => actionsMap[action]);
    }

    async getTools({ apps, actions }: { apps?: App[], actions?: Action[] }) {
        const appTools = apps ? this.getApps(apps) : [];
        const actionTools = actions ? this.getActions(actions) : [];

        return [...appTools, ...actionTools];
    }

    async executeAction({ action, innputParams = {} }: { action: Action, innputParams?: object }): Promise<IToolMessage> {
        try {
            const result = await actionsMap[action].invoke(innputParams);
            return JSON.parse(result) as IToolMessage;
        } catch (error: any) {
            console.error(error);

            const message = toolMessage({
                success: false,
                data: error.message,
            });

            return JSON.parse(message) as IToolMessage;
        }
    }

    async getIntegration(app: IntegrableApps) {
        
    }

    async getConnection(app: ConnectableApps) {

    }

    async initiateAppIntegration({ app, authData }: { app: IntegrableApps, authData: object }) {
        return await new appsMap[app]().initiateAppIntegration(authData);
    }

    async initiateAppConnection({ app, authData }: { app: ConnectableApps, authData: object }) {
        return await new appsMap[app]().initiateAppConnection(authData);
    }

    getExpectedParamsForIntegration({ app, type }: { app: IntegrableApps, type: AuthType }) {
        return new appsMap[app]().getExpectedParamsForIntegration(type);
    }

    getExpectedParamsForConnection({ app, type }: { app: ConnectableApps, type: AuthType }) {
        return new appsMap[app]().getExpectedParamsForConnection(type);
    }

}


