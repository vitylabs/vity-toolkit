import VityToolKitSDKContext from "../../utils/vityToolKitContext";


interface expectedParamsForApp {
    APP_KEY: string;
    APP_SECRET: string;
}

interface expectedParamsForUser {
    ACCESS_TOKEN: string;
    ACCESS_SECRET: string;
}


export class TwitterTool {
    private appPrivateKey: string | undefined;
    private userPrivateKey: string | undefined;

    constructor() {
        this.appPrivateKey = VityToolKitSDKContext.appPrivateKey;
        this.userPrivateKey = VityToolKitSDKContext.userPrivateKey;
    }

    getTools() {
        return [

        ]
    }

    getExpectedParamsForApp(): expectedParamsForApp {
        return {
            APP_KEY: "string",
            APP_SECRET: "string"
        }
    }

    getExpectedParamsForUser(): expectedParamsForUser {
        return {
            ACCESS_TOKEN: "string",
            ACCESS_SECRET: "string"
        }
    }

    async getAppConnectionForApp(app: string) {
    }

    async getAppConnectionForUser(app: string) {
    }

    async initiateAppIntegration({ app, input }: { app: string, input: expectedParamsForApp }) { // for the developer/company 
        console.log(`Initiating connection to ${app} with input: ${input}`);
    }

    async initiateAppConnectionForUser({ app, input }: { app: string, input: expectedParamsForUser }) { // for the user (after the developer/company has initiated the connection)
        console.log(`Initiating connection to ${app} with input: ${input}`);
    }

}


