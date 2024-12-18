import { VityToolKit, Action } from "vity-toolkit";


const toolKit = new VityToolKit({
    userPrivateKey: "3C82AFmHn64h2gYGQbPHFrQB9bJzT5hfSGXuTwpf9RCX59yvusZd5DhVMmq9AYbgRNooGqdY2D2oJqvPAX8CLnGv"
});
const result = await toolKit.executeAction({ action: Action.TWITTER_SEARCH, inputParams: { query: "solana" } });

console.log(result.data);