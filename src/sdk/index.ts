import { toolMessage, type IToolMessage } from "./helpers/common";
import { getPublicKey } from "./helpers/getPublicKey";
import { Action, actionsMap, App, appsMap, type ConnectableApps, type IntegrableApps } from "./tools";
import VityToolKitSDKContext from "./utils/vityToolKitContext";


export class VityToolKit {

    constructor(userPrivateKey?: string, appPrivateKey?: string) {
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
        return apps.flatMap(app => appsMap[app].getTools());
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

    async initiateAppIntegration({ app, authData }: { app: IntegrableApps, authData: object }) {
        return await appsMap[app].initiateAppIntegration(authData);
    }

    async initiateAppConnection({ app, authData }: { app: ConnectableApps, authData: object }) {
        return await appsMap[app].initiateAppConnection(authData);
    }

    getExpectedParamsForIntegration(app: IntegrableApps) {
        return appsMap[app].getExpectedParamsForIntegration();
    }

    getExpectedParamsForConnection(app: ConnectableApps) {
        return appsMap[app].getExpectedParamsForConnection();
    }

}


