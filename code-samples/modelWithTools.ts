import { Action, LangchainToolkit } from "vity-toolkit";
import { ChatOpenAI } from "@langchain/openai";


const model = new ChatOpenAI({ model: "gpt-4o" });

const toolKit = new LangchainToolkit();
const tools = toolKit.getTools({ actions: [Action.SOLANA_WALLET_GENERATE_KEYPAIR, Action.SOLANA_WALLET_GET_BALANCE] });

const modelWithTools = model.bindTools(tools);

const responseWithToolCalls = await modelWithTools.invoke([
    {
        role: "user",
        content: "Create a Solana Wallet and give me it's public key.",
    },
]);

console.log(`Content: ${responseWithToolCalls.content}`);
console.log(
    `Tool calls: ${JSON.stringify(responseWithToolCalls.tool_calls, null, 2)}`
);

