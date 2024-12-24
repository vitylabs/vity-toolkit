import Snoowrap from "snoowrap";
import VityToolKitSDKContext from "../../utils/vityToolKitContext";
import { AuthType } from "../../types";
import { connectionMessage } from "../../helpers/common";
import { redditFilterTool } from "./actions/filter";
import { Integration } from "../../utils/integration";
import { App } from "..";
import { Connection } from "../../utils/connection";


export class RedditTool {
    private appPrivateKey: string | undefined;
    private userPrivateKey: string | undefined;

    constructor() {
        // validation
        if (!VityToolKitSDKContext) {
            throw new Error('VityToolKit not initialized');
        }

        this.appPrivateKey = VityToolKitSDKContext.appPrivateKey;
        this.userPrivateKey = VityToolKitSDKContext.userPrivateKey;

        if (!this.appPrivateKey) { // App Private key is neccessary
            // this.appLit = new Lit(this.appPrivateKey);
            throw new Error("App private key is required to use this tool");
        }

        if (!this.userPrivateKey) { // User private key is require 
            throw new Error("User private key is required to use this tool");
        }
    }

    getTools() {
        return [
            redditFilterTool,
        ]
    }

    async createClient(): Promise<Snoowrap> {
        // get auth data (via integration and connection)
        const authData = await this.getAuthData();

        // create client
        return new Snoowrap({
            userAgent: process.env.REDDIT_USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
            clientId: authData.CLIENT_ID,
            clientSecret: authData.CLIENT_SECRET,
            username: authData.USERNAME,
            password: authData.PASSWORD
        })
    }

    private async getAuthData(): Promise<{ CLIENT_ID: string, CLIENT_SECRET: string, USERNAME: string, PASSWORD: string }> {
        const integrationAuthData = await new Integration().getIntegration({ app: App.REDDIT });
        const connectionAuthData = await new Connection().getConnection({ app: App.REDDIT });

        if (!integrationAuthData.success) {
            throw new Error("Failed to get auth data from integration");
        }
        if (!connectionAuthData.success) {
            throw new Error("Failed to get auth data from connection");
        }

        return { ...integrationAuthData.data, ...connectionAuthData.data };
    }

    static getExpectedParamsForIntegration(type?: AuthType) {
        return {
            "CLIENT_ID": "",
            "CLIENT_SECRET": ""
        }
    }

    static getExpectedParamsForConnection(type: AuthType) {
        switch (type) {
            case AuthType.OAUTH_1:
                throw new Error("Currently, we do not support OAuth 1 for Reddit");
            case AuthType.OAUTH_2:
                throw new Error("Currently, we do not support OAuth 2 for Reddit");
            case AuthType.API_KEY:
                throw new Error("Currently, we do not support API Key for Reddit");
            case AuthType.PASSWORD_BASED_AUTH:
                return {
                    "USERNAME": "",
                    "PASSWORD": ""
                }
        }
    }

}


