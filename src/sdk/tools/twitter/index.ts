import { Lit } from "../../utils/lit-protocol";
import VityToolKitSDKContext from "../../utils/vityToolKitContext";


export class TwitterTool {
    private appPrivateKey: string | undefined;
    private userPrivateKey: string | undefined;
    private appLit: Lit | undefined;
    private userLit: Lit | undefined;

    constructor() {
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

    getExpectedParamsForIntegration() {
        return {
            APP_KEY: "",
            APP_SECRET: ""
        }
    }

    getExpectedParamsForConnection() {
        return {
            ACCESS_TOKEN: "",
            ACCESS_SECRET: ""
        }
    }

    async isAppIntegrated() {
    }

    async isAppConnected() {
    }

    async initiateAppIntegration(authData: object) { // for the developer/company
        console.log("Integration authData", authData);
    }

    async initiateAppConnection(authData: object) { // for the user
        console.log("Connection authData", authData);
    }

}


