import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createToolCallingAgent } from "langchain/agents";
import { Action, App, LangchainToolkit } from "vity-toolkit";
import { AgentExecutor } from "langchain/agents";


const model = new ChatOpenAI({ model: "gpt-4o" });
const toolkit = new LangchainToolkit({
    appPrivateKey: process.env.DEMO_SOLANA_PRIVATE_KEY,
    userPrivateKey: process.env.DEMO_SOLANA_PRIVATE_KEY,
})

const tools = toolkit.getTools({ apps: [App.EARN, App.REDDIT] })

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
    // verbose: true,
});

console.log(await agentExecutor.invoke({ input: "Tell me what is going on solana ecosystem by reading solana subreddits and bounty listings from superteam earn" }));