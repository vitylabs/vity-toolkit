import { connectionMessage, integrationMessage } from "../../helpers/common";
import { AuthType } from "../../types";
import { Lit } from "../../utils/lit-protocol";
import VityToolKitSDKContext from "../../utils/vityToolKitContext";


export class TwitterTool {
    private appPrivateKey: string | undefined;
    private userPrivateKey: string | undefined;
    private appLit: Lit | undefined;
    private userLit: Lit | undefined;

    constructor() {
        if (!VityToolKitSDKContext) {
            throw new Error('VityToolKit not initialized');
        }

        this.appPrivateKey = VityToolKitSDKContext.appPrivateKey;
        this.userPrivateKey = VityToolKitSDKContext.userPrivateKey;

        if (this.appPrivateKey && this.userPrivateKey) {
            this.appLit = new Lit(this.appPrivateKey);
            this.userLit = new Lit(this.userPrivateKey);
        } else {
            throw new Error("App and user private keys are required to use this tool");
        }
    }

    getTools() {
        return [

        ]
    }

    getExpectedParamsForIntegration(type: AuthType) {
        return integrationMessage({
            success: false,
            message: "Currently, we do not support integration for Twitter"
        });
    }

    getExpectedParamsForConnection(type: AuthType) {
        switch (type) {
            case AuthType.OAUTH:
                return connectionMessage({
                    success: false,
                    message: "Currently, we do not support OAuth for Twitter"
                });
            case AuthType.API_KEY:
                return connectionMessage({
                    success: false,
                    message: "Currently, we do not support API Key for Twitter"
                });
            case AuthType.PASSWORD_BASED_AUTH:
                return {
                    USERNAME: "",
                    PASSWORD: ""
                }
        }
    }

    async getIntegration() {
        return null;
    }

    async getConnection() {
        return null;
    }

    async initiateAppIntegration(authData: object) { // for the developer/company
        return integrationMessage({
            success: false,
            message: "Currently, we do not support integration for Twitter"
        });
    }

    async initiateAppConnection(authData: object) { // for the user
        console.log("Connection authData", authData);
    }

}


