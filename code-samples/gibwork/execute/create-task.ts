import { VityToolKit, Action } from "vity-toolkit";


const toolKit = new VityToolKit({
    userPrivateKey: process.env.SOLANA_PRIVATE_KEY
});

// 1. Get expected params for an action
// const expectedParams = toolKit.getInputParamsForAction({ action: Action.GIBWORK_CREATE_TASK });
// console.log(expectedParams);

// 2. Get expected params for executing the action
const params = {
    title: "Follow my Twitter account @thatsmeadarsh",
    content: "Submit a screenshot showing you’ve followed, along with your Twitter profile link, to qualify for the reward",
    requirements: "If you have 50+ followers",
    tags: ["Twitter", "Follow", "Social Media"],
    tokenMintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    amount: 11,
}

const result = await toolKit.executeAction({ action: Action.GIBWORK_CREATE_TASK, inputParams: params });
console.log(result.data);