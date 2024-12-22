import { ChatOpenAI } from "@langchain/openai";
import { Action, LangchainToolkit } from "vity-toolkit";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";


const llm = new ChatOpenAI({ model: "gpt-4o" });
const toolKit = new LangchainToolkit();

const tools = toolKit.getTools({ actions: [Action.SOLANA_WALLET_GENERATE_KEYPAIR, Action.SOLANA_WALLET_GET_BALANCE, Action.SOLANA_WALLET_GET_MY_PUBLIC_KEY] });

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant"],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt,
});

const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
});

// console.log(await agentExecutor.invoke({ input: "Create a Solana Wallet and give me it's public key. Also tell me it's balance." }));
console.log(await agentExecutor.invoke({ input: "What is the balance of 8ueAQRiLExT7M9CNSkR11FDGbx2UyJqpSxCp1y43PWWs in mainnet-beta in USDC?" }));
// console.log(await agentExecutor.invoke({ input: "What is the balance of 8ueAQRiLExT7M9CNSkR11FDGbx2UyJqpSxCp1y43PWWs?" }));
// console.log(await agentExecutor.invoke({ input: "What is the balance of my account in devnet?" }));