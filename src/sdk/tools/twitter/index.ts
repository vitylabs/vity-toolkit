import { connectionMessage, integrationMessage } from "../../helpers/common";
import { AuthType } from "../../types";
import { Lit } from "../../utils/lit-protocol";
import VityToolKitSDKContext from "../../utils/vityToolKitContext";
import { TwitterApi } from 'twitter-api-v2';
import { TwitterToolAPIContext } from "./context";

export class TwitterTool {
    private appPrivateKey: string | undefined;
    private userPrivateKey: string | undefined;
    private userType: "developer" | "user" = "developer";
    private appLit: Lit | undefined;
    private userLit: Lit | undefined;

    constructor() {
        if (!VityToolKitSDKContext) {
            throw new Error('VityToolKit not initialized');
        }

        this.appPrivateKey = VityToolKitSDKContext.appPrivateKey;
        this.userPrivateKey = VityToolKitSDKContext.userPrivateKey;

        if (this.appPrivateKey) { // App Private key isn't always neccessary 
            this.appLit = new Lit(this.appPrivateKey);
        } else {
            this.userType = "user";
        }

        if (!this.userPrivateKey) { // User private key is always required
            throw new Error("User private key is required to use this tool");
        } else {
            this.userLit = new Lit(this.userPrivateKey);
        }

        // @TODO: get the user's twitter credentials

        TwitterToolAPIContext.client = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY as string,
            appSecret: process.env.TWITTER_API_SECRET as string,
            accessToken: process.env.TWITTER_ACCESS_TOKEN as string,
            accessSecret: process.env.TWITTER_ACCESS_SECRET as string,
        });

    }

    getTools() {
        return [

        ]
    }

    // getExpectedParamsForIntegration(type: AuthType) {
    //     return integrationMessage({
    //         success: false,
    //         message: "Currently, we do not support integration for Twitter"
    //     });
    // }

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

    // async getIntegration() {
    //     return null;
    // }

    async getConnection() {
        return null;
    }

    // async initiateAppIntegration(authData: object) { // for the developer/company
    //     return integrationMessage({
    //         success: false,
    //         message: "Currently, we do not support integration for Twitter"
    //     });
    // }

    async initiateAppConnection(authData: object) { // for the user
        console.log("Connection authData", authData);
    }

}


