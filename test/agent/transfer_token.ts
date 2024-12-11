import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createToolCallingAgent } from "langchain/agents";
import { Action, VityToolKit } from "../../src";
import { AgentExecutor } from "langchain/agents";


const model = new ChatOpenAI({ model: "gpt-4o" });
const toolKit = new VityToolKit("<private-key>");

const tools = await toolKit.getActions([Action.SOLANA_WALLET_TRANSFER, Action.SOLANA_WALLET_GET_BALANCE, Action.SOLANA_WALLET_GET_MY_PUBLIC_KEY]);
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


// console.log(await agentExecutor.invoke({ input: "Transfer 0.000001 SOL to 2YpAynL5LSuSNXye2nhduqsP5MHGNi69rgipFfwd7U78 in mainnet" }));
console.log(await agentExecutor.invoke({ input: "Transfer 0.001 USDC to 8ueAQRiLExT7M9CNSkR11FDGbx2UyJqpSxCp1y43PWWs in mainnet" }));

