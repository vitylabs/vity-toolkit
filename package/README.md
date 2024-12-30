<h1 align="center">Vity ToolKit 🧰</h1>

<p align="center">A framework to integrate AI agents and LLMs with Web2 and Web3 tools, ensuring secure and seamless authentication and reliability. Inspired from <a href="https://composio.dev/">composio</a></p>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#-demo">Demo</a></li>
    <li><a href="#-features">Features</a></li>
    <li><a href="#-quick-start">Quick Start</a></li>
    <li><a href="#-contributing">Contributing</a></li>
  </ol>
</details>

## 🎥 DEMO
[![demo video](https://github.com/user-attachments/assets/14c2b876-dc7b-4d21-8997-dc833dfdf41d)](https://drive.google.com/file/d/1S3mY4NzMSi-NH8pqEK-qrDL1WYWhFSYN/view)

## 📙 Features
Vity Toolkit is an open-source framework that works with any LLM that supports tool use. It is your gateway to AI integrations:

- **Seamless Connections**: Link AI agents to multiple apps like X, Superteam Earn, Solana Wallet, etc.
- **Agent Authentication**: Easily and securely manage user-level authentication across multiple accounts and tools using Lit Protocol and connect it with any storage provider, allowing you to use your preferred storage solution, such as IPFS, Arweave, Ceramic, or even a centralized provider like AWS.
- **Extensions**: Connect other toolkits like Solana Agent Kit, very easily.
- **Frameworks**: Support different frameworks like Langchain, OpenAI, Vercel AI (comming soon).
- **Effortless Integration**: From using actions to auth integration, all made simple and easy, thanks to typescript.

## 🚀 Quick Start
1. Install the package.
```bash
npm install vity-toolkit ai @ai-sdk/openai
```
2. Using App of Vity Toolkit in Vercel AI SDK
```ts
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
```

## 🤗 Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes.
4. Push your branch: `git push origin feature-name`.
5. Create a pull request.


