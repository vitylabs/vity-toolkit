import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createToolCallingAgent } from "langchain/agents";
import { Action, LangchainToolkit } from "vity-toolkit";
import { AgentExecutor } from "langchain/agents";


const model = new ChatOpenAI({ model: "gpt-4o" });
const toolKit = new LangchainToolkit({
    appPrivateKey: process.env.DEMO_SOLANA_PRIVATE_KEY,
    userPrivateKey: process.env.DEMO_SOLANA_PRIVATE_KEY
});

const tools = toolKit.getTools({ actions: [Action.REDDIT_CREATE_POST] });
const prompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an AI agent responsible for taking actions on Reddit on users' behalf. 
        You need to take action on Reddit using Reddit APIs. Use correct tools to run APIs from the given tool-set.`],
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

console.log(await agentExecutor.invoke({ input: "Create a new post in the LearnPython subreddit with title `Is learning python worth it in 2025?` and post text as `I am a bit scared with the evolution of AI agents. What do you think?`. Give me the post Id." }));