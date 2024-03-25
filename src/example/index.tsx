import * as React from 'react';
import readline from 'readline';
import { OpenAI } from 'openai';
import {
  System, 
  User, 
  Text,
  Assistant, 
  getChatCompletion,
  ChatResponseFormatEnum,
  ChatModelsEnum,
  getChatCompletionRenderer,
  ChatCompletion,
  getString,
  IMessage
} from '../../dist/src/lib';

import * as fs from 'fs-extra';
import path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function getTree(dirPath: string, level = 0): Promise<string> {
  let result = '';
  const indent = ' '.repeat(level * 2);
  const files = await fs.readdir(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      result += `${indent}+ ${file}\n`;
      result += await getTree(filePath, level + 1);
    } else {
      result += `${indent}- ${file}\n`;
    }
  }

  return result;
}

const targetDir = './src/example/markdown/';

class GPTWrapperWithTools {
  tools: {
    toolName: string;
    trigger: string;
    command: string;
    params: Record<string, string>;
    execute: (params: Record<string, string>) => Promise<any>;
  }[] = []

  children: React.ReactNode[] = []

  getChildren = () => this.children
  
  constructor(systemPromptJSX: React.ReactNode, tools: {
    toolName: string;
    trigger: string;
    command: string;
    params: Record<string, string>;
    execute: (params: Record<string, string>) => Promise<any>;
  }[] = []) {
    this.tools = tools;
    this.children = [
      <System>{getString(systemPromptJSX)}</System>
    ]
  }

  getChatCompletionComponent = () => {
    return <ChatCompletion tools={this.tools}>
    {this.children}
  </ChatCompletion>
  }

  appendUserPromptJSX = (userPromptJSX: React.ReactNode) => {
    this.children.push(userPromptJSX)
  }


  getChatCompletion = async () => {
    const renderChatCompletion = getChatCompletionRenderer(async (messages: IMessage[]) => {
      const chatCompletionMessages = messages as unknown as OpenAI.ChatCompletionMessage[];
      return await getChatCompletion(process.env.OPENAI_KEY as string, chatCompletionMessages, ChatModelsEnum.GPT_3P5_TURBO_0125, ChatResponseFormatEnum.JSON);
    });
    const chatCompletionComponent = this.getChatCompletionComponent();
    const chatCompletion = await renderChatCompletion(chatCompletionComponent);
    const {runTool, message} = chatCompletion;
    const {result} = await runTool();
    this.appendUserPromptJSX(<Assistant>{result}</Assistant>);
    return {
      role: 'assistant',
      content: result,
    }
  }

}

const main = async () => {

  const tree = await getTree(targetDir);

  const gptWrapper = new GPTWrapperWithTools(
    <System>
      # Your job is that of a librarian managing a repo of markdown text 

      Below is a tree representation of the repo of MD/Markdown files: 

      {tree}
    </System>,
    [
      {
        toolName: "Open a Markdown File",
        trigger: "for when you need to open the README.md file",
        command: "OPEN_MARKDOWN",
        params: {filePath: 'string'},
        execute: async ({filePath}) => {
          try {
            const fileContents = await fs.readFileSync(`${targetDir}${filePath}`, 'utf-8');
            return `Here is the contents of the file: \n\n${fileContents}`;
          } catch (error) {
            return `There was an error opening the file: ${filePath}`;
          }
        }
      },
      {
        toolName: "Render my repo tree",
        trigger: "for when you or the user needs to look at the file system",
        command: "RENDER_TREE",
        params: {},
        execute: async () => {
          const renderedTree = await getTree(targetDir);
          return renderedTree;
        }
      },
      {
        toolName: "Write a Markdown file to the repo",
        trigger: "for when you or the user needs to write a Markdown file down to the repo",
        command: "WRITE_MARKDOWN_FILE",
        params: {
          fileName: 'string',
          fileContents: 'string',
        },
        execute: async ({
          fileName, fileContents
        }) => {
          await fs.writeFileSync(`${targetDir}${fileName}`, fileContents);
          return `Successfully wrote file: ${targetDir}${fileName}`;
        }
      },
      {
        toolName: "Ask the user a question",
        trigger: "for when you need to ask the user a question",
        command: "ASK_USER_QUESTION",
        params: {
          question: 'string'
        },
        execute: async ({question}) => {
          return `${question}`;
        }
      },
      {
        toolName: "Respond to the user with a message",
        trigger: "for when you need to talk to the user",
        command: "TALK_TO_USER",
        params: {
          content: 'string'
        },
        execute: async ({content}) => {
          return `${content}`;
        }
      }
    ]
  )


  function promptUser() {
    rl.question('Enter your command: ', async (command) => {
      // Here you can parse the command and interact with your GPTWrapperWithTools
      // For simplicity, let's just pass the command directly
      gptWrapper.appendUserPromptJSX(<User>{command}</User>);

      const message = await gptWrapper.getChatCompletion();

      console.log('Assistant says:', message.content);

      // Continue prompting the user after each interaction
      promptUser();
    });
  }

  // Start the CLI interaction
  promptUser();

}

main().catch(console.error);