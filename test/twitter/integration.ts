import { VityToolKit } from "../../src";
import { App } from "../../src/sdk/tools";

const toolKit = new VityToolKit();

const expectedParams = toolKit.getExpectedParamsForIntegration(App.TWITTER);
expectedParams.APP_KEY = "APP_KEY";
expectedParams.APP_SECRET = "APP_SECRET";

const result = await toolKit.initiateAppIntegration({app: App.TWITTER, authData: expectedParams});

