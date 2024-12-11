import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createToolCallingAgent } from "langchain/agents";
import { Action, VityToolKit } from "../../src";
import { AgentExecutor } from "langchain/agents";


const model = new ChatOpenAI({ model: "gpt-4o" });
const toolKit = new VityToolKit();
// const toolKit = new VityToolKit("3C82AFmHn64h2gYGQbPHFrQB9bJzT5hfSGXuTwpf9RCX59yvusZd5DhVMmq9AYbgRNooGqdY2D2oJqvPAX8CLnGv");

const tools = await toolKit.getActions([Action.SOLANA_WALLET_GENERATE_KEYPAIR, Action.SOLANA_WALLET_GET_BALANCE, Action.SOLANA_WALLET_GET_MY_PUBLIC_KEY]);
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant"],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
]);


const agent = createToolCallingAgent({ llm: model, tools, prompt });

const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
});

// console.log(await agentExecutor.invoke({ input: "Create a Solana Wallet and give me it's public key. Also tell me it's balance." }));
console.log(await agentExecutor.invoke({ input: "What is the balance of 8ueAQRiLExT7M9CNSkR11FDGbx2UyJqpSxCp1y43PWWs in mainnet-beta in USDC?" }));
// console.log(await agentExecutor.invoke({ input: "What is the balance of 8ueAQRiLExT7M9CNSkR11FDGbx2UyJqpSxCp1y43PWWs?" }));
// console.log(await agentExecutor.invoke({ input: "What is the balance of my account in devnet?" }));