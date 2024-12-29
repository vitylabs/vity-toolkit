import { VityToolKit, Action } from "vity-toolkit";


const toolKit = new VityToolKit({
    appPrivateKey: process.env.DEMO_SOLANA_PRIVATE_KEY,
    userPrivateKey: process.env.DEMO_SOLANA_PRIVATE_KEY
});

// 1. Get expected params for an action
// const expectedParams = toolKit.getInputParamsForAction({ action: Action.REDDIT_FILTER });
// console.log(expectedParams);

// 2. Get expected params for executing the action
const params = {
    subreddit: "python",
    query: ["fastapi"],
    sort: "new",
    limit: 1,
    time: "all",
}

const result = await toolKit.executeAction({ action: Action.REDDIT_FILTER, inputParams: params });
console.log(result.data);