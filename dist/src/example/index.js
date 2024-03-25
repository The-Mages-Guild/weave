"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const lib_1 = require("../lib/");
const fs = require("fs-extra");
const path_1 = require("path");
async function getTree(dirPath, level = 0) {
    let result = '';
    const indent = ' '.repeat(level * 2);
    const files = await fs.readdir(dirPath);
    for (const file of files) {
        const filePath = path_1.default.join(dirPath, file);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
            result += `${indent}+ ${file}\n`;
            result += await getTree(filePath, level + 1);
        }
        else {
            result += `${indent}- ${file}\n`;
        }
    }
    return result;
}
const targetDir = './markdown';
getTree(targetDir).catch(console.error);
class GPTWrapperWithTools {
    tools = [];
    children = [];
    getChildren = () => this.children;
    constructor(tools = [], systemPromptJSX) {
        this.tools = tools;
        this.children = [
            systemPromptJSX
        ];
    }
    chatCompletionComponent = ((0, jsx_runtime_1.jsx)(lib_1.ChatCompletion, { tools: this.tools, children: this.children }));
    getChatCompletionComponent = () => {
        return this.chatCompletionComponent;
    };
    appendUserPromptJSX = (userPromptJSX) => {
        this.children.push(userPromptJSX);
    };
    getChatCompletion = async () => {
        const renderChatCompletion = (0, lib_1.getChatCompletionRenderer)(async (messages) => {
            const key = process.env.OPENAI_KEY || '';
            const chatCompletionMessages = messages;
            return await (0, lib_1.getChatCompletion)(key, chatCompletionMessages, lib_1.ChatModelsEnum.GPT_3P5_TURBO_0125, lib_1.ChatResponseFormatEnum.JSON);
        });
        const chatCompletionComponent = this.getChatCompletionComponent();
        return await renderChatCompletion(chatCompletionComponent);
    };
}
const main = async () => {
    const tree = await getTree(targetDir);
    const gptWrapper = new GPTWrapperWithTools([
        {
            toolName: "Open a Markdown File",
            trigger: "for when you need to open the README.md file",
            command: "OPEN_README",
            params: {},
            execute: async () => {
                return 'Opened README.md file';
            }
        }
    ], (0, jsx_runtime_1.jsxs)(lib_1.System, { children: ["# Your job is that of a librarian managing a repo of markdown text Below is a tree representation of the repo of MD/Markdown files:", tree] }));
    gptWrapper.appendUserPromptJSX((0, jsx_runtime_1.jsx)(lib_1.User, { children: "Open the README.md file please" }));
    const { runTool, message } = await gptWrapper.getChatCompletion();
    console.log({ runTool, message });
};
main().catch(console.error);
