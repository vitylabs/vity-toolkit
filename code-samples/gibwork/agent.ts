import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createToolCallingAgent } from "langchain/agents";
import { Action, App, LangchainToolkit } from "vity-toolkit";
import { AgentExecutor } from "langchain/agents";


const model = new ChatOpenAI({ model: "gpt-4o" });
const toolKit = new LangchainToolkit({
    userPrivateKey: "3C82AFmHn64h2gYGQbPHFrQB9bJzT5hfSGXuTwpf9RCX59yvusZd5DhVMmq9AYbgRNooGqdY2D2oJqvPAX8CLnGv"
});

const tools = toolKit.getTools({ apps: [App.GIBWORK] });
const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an AI agent responsible for taking actions on Gibwork on users' behalf. 
        You need to take action on Gibwork using Gibwork APIs. Use correct tools to run APIs from the given tool-set.`],
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

const response = await agentExecutor.invoke({ input: "Create a Gibwork task: Follow my Twitter account @thatsmeadarsh if you have 50+ followers. My total budget is 11 USDC. Submit a screenshot showing you’ve followed, along with your Twitter profile link, to qualify for the reward. The mint address for USDC is EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" });

console.log(response);