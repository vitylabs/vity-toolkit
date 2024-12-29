import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { App, VercelAIToolkit } from "vity-toolkit";


const toolKit = new VercelAIToolkit();
const tools = toolKit.getTools({ apps: [App.EARN] });

const { text } = await generateText({
    model: openai("gpt-4o"),
    tools,
    maxSteps: 5,
    prompt: "What is top 5 bounties in superteam earn?",
});

console.log(text);

