import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createToolCallingAgent } from "langchain/agents";
import { App, LangchainToolkit } from "vity-toolkit";
import { AgentExecutor } from "langchain/agents";


const model = new ChatOpenAI({ model: "gpt-4o" });
const toolKit = new LangchainToolkit();

const tools = toolKit.getTools({ apps: [App.SOLANA_WALLET] });
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

console.log(await agentExecutor.invoke({ input: "Create a Solana Wallet and give me it's public key. Also tell me it's balance." }));