define("src/lib/utils/index", ["require", "exports", "react-dom/server", "he"], function (require, exports, server_1, he_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getString = void 0;
    const getString = (component) => {
        return (0, he_1.unescape)((0, server_1.renderToString)(component)).split("<!-- -->").join(`
  `);
    };
    exports.getString = getString;
});
define("src/lib/core/markdown", ["require", "exports", "react/jsx-runtime", "react"], function (require, exports, jsx_runtime_1, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Markdown = void 0;
    const Markdown = ({ children }) => {
        const childArray = Array.isArray(children) ? children : [children];
        const childString = childArray.map(child => {
            if (typeof child === 'string') {
                return child;
            }
            else if (React.isValidElement(child)) {
                return child.props.children;
            }
            else {
                return '\n';
            }
        }).join('\n');
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: childString }));
    };
    exports.Markdown = Markdown;
});
define("src/lib/core/text", ["require", "exports", "react/jsx-runtime", "src/lib/core/markdown"], function (require, exports, jsx_runtime_2, markdown_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Text = void 0;
    const Text = ({ children }) => ((0, jsx_runtime_2.jsx)(markdown_1.Markdown, { children: children }));
    exports.Text = Text;
});
define("src/lib/core/metadata", ["require", "exports", "react"], function (require, exports, React) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Metadata = void 0;
    const Metadata = (props) => {
        return React.createElement('Metadata', props, null);
    };
    exports.Metadata = Metadata;
});
define("src/lib/openai/service/index", ["require", "exports", "openai"], function (require, exports, openai_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getChatCompletion = exports.ChatResponseFormatEnum = exports.ChatModelsEnum = void 0;
    var ChatModelsEnum;
    (function (ChatModelsEnum) {
        ChatModelsEnum["GPT_3P5_TURBO"] = "gpt-3.5-turbo";
        ChatModelsEnum["GPT_3P5_TURBO_0125"] = "gpt-3.5-turbo-0125";
        ChatModelsEnum["GPT_4_0125_PREVIEW"] = "gpt-4-0125-preview";
    })(ChatModelsEnum || (exports.ChatModelsEnum = ChatModelsEnum = {}));
    var ChatResponseFormatEnum;
    (function (ChatResponseFormatEnum) {
        ChatResponseFormatEnum["JSON"] = "json_object";
        ChatResponseFormatEnum["TEXT"] = "text";
    })(ChatResponseFormatEnum || (exports.ChatResponseFormatEnum = ChatResponseFormatEnum = {}));
    const getChatCompletion = async (apiKey, messages, model, responseFormat) => {
        if (!apiKey)
            throw new Error('No API Key provided in <OpenAI.ChatCompletions />');
        if (model === ChatModelsEnum.GPT_3P5_TURBO && responseFormat !== undefined) {
            throw new Error(`${responseFormat} does not support response format`);
        }
        const openai = new openai_1.default({
            apiKey
        });
        if (responseFormat === ChatResponseFormatEnum.JSON) {
            const chatCompletion = await openai.chat.completions.create({
                messages,
                model: model,
                response_format: { type: responseFormat },
            });
            return chatCompletion;
        }
        const chatCompletion = await openai.chat.completions.create({
            messages,
            model: model
        });
        return chatCompletion;
    };
    exports.getChatCompletion = getChatCompletion;
});
define("src/lib/core/chat-completion", ["require", "exports", "react/jsx-runtime", "react", "src/lib/utils/index"], function (require, exports, jsx_runtime_3, React, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getChatCompletionRenderer = exports.ChatCompletion = exports.ToolContext = void 0;
    exports.ToolContext = React.createContext({ tools: [] });
    const ToolsProvider = ({ children, tools }) => {
        return (0, jsx_runtime_3.jsx)(exports.ToolContext.Provider, { value: { tools }, children: children });
    };
    const Chat = ({ tools, children }) => {
        const messages = React.Children.map(children, child => {
            const data = (0, utils_1.getString)((0, jsx_runtime_3.jsx)(ToolsProvider, { tools: tools, children: child }));
            return JSON.parse(data);
        });
        return (0, jsx_runtime_3.jsx)(jsx_runtime_3.Fragment, { children: JSON.stringify(messages) });
    };
    const ChatCompletion = ({ tools, children }) => {
        const messages = (0, utils_1.getString)((0, jsx_runtime_3.jsx)(Chat, { tools: tools, children: children }));
        const parsedMessages = JSON.parse(messages);
        return (0, jsx_runtime_3.jsx)(jsx_runtime_3.Fragment, { children: JSON.stringify(parsedMessages) });
    };
    exports.ChatCompletion = ChatCompletion;
    const getChatCompletionRenderer = (chatCompletionCallback) => {
        return async (jsxChatCompletionComponent) => {
            const tools = jsxChatCompletionComponent.props.tools || [];
            let toolsToExecute = {};
            tools.forEach((tool) => {
                if (tool.command in toolsToExecute) {
                    throw new Error(`Duplicate command ${tool.command}`);
                }
                if (tool.trigger in toolsToExecute) {
                    throw new Error(`Duplicate trigger ${tool.trigger}`);
                }
                if (tool.toolName in toolsToExecute) {
                    throw new Error(`Duplicate toolName ${tool.toolName}`);
                }
                toolsToExecute[tool.command] = tool.execute;
            });
            const messages = (0, utils_1.getString)(jsxChatCompletionComponent);
            const parsedMessages = JSON.parse(messages);
            const completions = await chatCompletionCallback(parsedMessages);
            const message = completions.choices[0].message;
            try {
                if (message && message.content) {
                    const parsedMessage = JSON.parse(message.content);
                    if (parsedMessage.command in toolsToExecute) {
                        const params = parsedMessage.params;
                        return {
                            runTool: async () => {
                                const result = await toolsToExecute[parsedMessage.command](params);
                                return {
                                    type: parsedMessage.command,
                                    result
                                };
                            },
                            message
                        };
                    }
                    return {
                        runTool: async () => {
                            return {
                                type: 'DEFAULT',
                                result: message.content
                            };
                        },
                        message
                    };
                }
            }
            catch (error) {
                return {
                    runTool: async () => {
                        return {
                            type: 'DEFAULT',
                            result: message.content
                        };
                    },
                    message
                };
            }
            return {
                runTool: async () => {
                    return {
                        type: 'DEFAULT',
                        result: message.content
                    };
                },
                message
            };
        };
    };
    exports.getChatCompletionRenderer = getChatCompletionRenderer;
});
define("src/lib/core/toolbox/index", ["require", "exports", "react/jsx-runtime", "react", "src/lib/core/text"], function (require, exports, jsx_runtime_4, React, text_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getToolBox = exports.findAllToolBoxes = exports.Tool = exports.ToolBox = void 0;
    const ToolBox = ({ children }) => {
        return (0, jsx_runtime_4.jsx)(jsx_runtime_4.Fragment, { children: children });
    };
    exports.ToolBox = ToolBox;
    const Tool = ({ toolName, trigger, command, params, execute }) => {
        const favouredJSON = {
            command: command,
            params: params,
        };
        return ((0, jsx_runtime_4.jsx)(jsx_runtime_4.Fragment, { children: (0, jsx_runtime_4.jsxs)(text_1.Text, { children: ["=== Tool: [", toolName, "] === Trigger: ", trigger, "You must respond with the following JSON object as your command to the app:", JSON.stringify(favouredJSON, null, 2), "=== [/", toolName, "] ==="] }) }));
    };
    exports.Tool = Tool;
    function findAllToolBoxes(element, toolBoxes = []) {
        // Check if the current element is a ToolBox and add it to the array if so
        if (React.isValidElement(element) && element.type === exports.ToolBox) {
            toolBoxes.push(element);
        }
        // If the element has children, search through them
        if (React.isValidElement(element) && React.Children.count(element.props.children) > 0) {
            React.Children.forEach(element.props.children, (child) => {
                findAllToolBoxes(child, toolBoxes);
            });
        }
        // Return the collected ToolBoxes
        return toolBoxes;
    }
    exports.findAllToolBoxes = findAllToolBoxes;
    const getToolBox = (jsxToolBoxComponent) => {
        let _toolBox = {};
        // Check if it's a ToolBox
        if (jsxToolBoxComponent.type === exports.ToolBox) {
            // Iterate through each Tool
            React.Children.forEach(jsxToolBoxComponent.props.children, child => {
                if (child.type === exports.Tool) {
                    _toolBox = {
                        ..._toolBox,
                        [child.props.command]: child.props.execute,
                    };
                }
            });
        }
        return _toolBox;
    };
    exports.getToolBox = getToolBox;
});
define("src/lib/core/messages/index", ["require", "exports", "react/jsx-runtime", "react", "src/lib/utils/index", "src/lib/core/text", "src/lib/core/chat-completion", "src/lib/core/toolbox/index"], function (require, exports, jsx_runtime_5, React, utils_2, text_2, chat_completion_1, toolbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getMessages = exports.getMessageRole = exports.Assistant = exports.User = exports.System = void 0;
    const messageComponentStringify = (role, children, name) => {
        const string = (0, utils_2.getString)(children);
        return JSON.stringify({
            role: role,
            content: `${string}`,
            name
        });
    };
    const CoreMessage = ({ role, name, children }) => {
        const string = Array.isArray(children) ? children.join("") : (0, utils_2.getString)(children);
        return ((0, jsx_runtime_5.jsx)(jsx_runtime_5.Fragment, { children: (0, jsx_runtime_5.jsx)(text_2.Text, { children: messageComponentStringify(role, string, name) }) }));
    };
    const System = ({ name, children }) => {
        const { tools } = React.useContext(chat_completion_1.ToolContext);
        return ((0, jsx_runtime_5.jsxs)(CoreMessage, { role: "system", name: name, children: [children, tools && tools.map(({ toolName, trigger, command, params, execute }, index) => {
                    return (0, utils_2.getString)((0, jsx_runtime_5.jsx)(toolbox_1.Tool, { toolName: toolName, trigger: trigger, command: command, params: params, execute: execute }, index));
                })] }));
    };
    exports.System = System;
    const User = ({ name, children }) => {
        return ((0, jsx_runtime_5.jsx)(CoreMessage, { role: "user", name: name, children: children }));
    };
    exports.User = User;
    const Assistant = ({ name, children }) => {
        return ((0, jsx_runtime_5.jsx)(CoreMessage, { role: "assistant", name: name, children: children }));
    };
    exports.Assistant = Assistant;
    const getMessageRole = (child) => {
        if (child.type === exports.User) {
            return 'user';
        }
        if (child.type === exports.Assistant) {
            return 'assistant';
        }
        if (child.type === exports.System) {
            return 'system';
        }
        return 'system';
    };
    exports.getMessageRole = getMessageRole;
    const getMessages = (jsxMessagesComponent) => {
        return React.Children.map(jsxMessagesComponent.props.children, child => {
            const name = child.props.name;
            if (child.type === exports.User || child.type === exports.Assistant || child.type === exports.System) {
                if (name) {
                    return {
                        role: (0, exports.getMessageRole)(child),
                        content: `${(0, utils_2.getString)(child.props.children)}`,
                        name,
                    };
                }
                return {
                    role: (0, exports.getMessageRole)(child),
                    content: `${(0, utils_2.getString)(child.props.children)}`,
                };
            }
        });
    };
    exports.getMessages = getMessages;
});
define("src/lib/core/index", ["require", "exports", "src/lib/core/text", "src/lib/core/markdown", "src/lib/core/messages/index", "src/lib/core/toolbox/index", "src/lib/core/chat-completion"], function (require, exports, text_3, markdown_2, messages_1, toolbox_2, chat_completion_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getChatCompletionRenderer = exports.ChatCompletion = exports.getToolBox = exports.findAllToolBoxes = exports.Tool = exports.ToolBox = exports.getMessages = exports.getMessageRole = exports.Assistant = exports.User = exports.System = exports.Markdown = exports.Text = void 0;
    Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return text_3.Text; } });
    Object.defineProperty(exports, "Markdown", { enumerable: true, get: function () { return markdown_2.Markdown; } });
    Object.defineProperty(exports, "System", { enumerable: true, get: function () { return messages_1.System; } });
    Object.defineProperty(exports, "User", { enumerable: true, get: function () { return messages_1.User; } });
    Object.defineProperty(exports, "Assistant", { enumerable: true, get: function () { return messages_1.Assistant; } });
    Object.defineProperty(exports, "getMessageRole", { enumerable: true, get: function () { return messages_1.getMessageRole; } });
    Object.defineProperty(exports, "getMessages", { enumerable: true, get: function () { return messages_1.getMessages; } });
    Object.defineProperty(exports, "ToolBox", { enumerable: true, get: function () { return toolbox_2.ToolBox; } });
    Object.defineProperty(exports, "Tool", { enumerable: true, get: function () { return toolbox_2.Tool; } });
    Object.defineProperty(exports, "findAllToolBoxes", { enumerable: true, get: function () { return toolbox_2.findAllToolBoxes; } });
    Object.defineProperty(exports, "getToolBox", { enumerable: true, get: function () { return toolbox_2.getToolBox; } });
    Object.defineProperty(exports, "ChatCompletion", { enumerable: true, get: function () { return chat_completion_2.ChatCompletion; } });
    Object.defineProperty(exports, "getChatCompletionRenderer", { enumerable: true, get: function () { return chat_completion_2.getChatCompletionRenderer; } });
});
// Execute
// export { execute } from './execute';
define("src/lib/index", ["require", "exports", "src/lib/utils/index", "src/lib/core/index", "src/lib/openai/service/index", "src/lib/openai/service/index"], function (require, exports, utils_3, core_1, service_1, service_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChatResponseFormatEnum = exports.ChatModelsEnum = exports.getChatCompletion = exports.ChatCompletion = exports.getChatCompletionRenderer = exports.Assistant = exports.User = exports.System = exports.Markdown = exports.Text = exports.getString = void 0;
    Object.defineProperty(exports, "getString", { enumerable: true, get: function () { return utils_3.getString; } });
    Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return core_1.Text; } });
    Object.defineProperty(exports, "Markdown", { enumerable: true, get: function () { return core_1.Markdown; } });
    Object.defineProperty(exports, "System", { enumerable: true, get: function () { return core_1.System; } });
    Object.defineProperty(exports, "User", { enumerable: true, get: function () { return core_1.User; } });
    Object.defineProperty(exports, "Assistant", { enumerable: true, get: function () { return core_1.Assistant; } });
    // getMessageRole, 
    // getMessages,
    // ToolBox,
    // Tool,  
    // findAllToolBoxes,
    // getToolBox,
    Object.defineProperty(exports, "getChatCompletionRenderer", { enumerable: true, get: function () { return core_1.getChatCompletionRenderer; } });
    Object.defineProperty(exports, "ChatCompletion", { enumerable: true, get: function () { return core_1.ChatCompletion; } });
    Object.defineProperty(exports, "getChatCompletion", { enumerable: true, get: function () { return service_1.getChatCompletion; } });
    Object.defineProperty(exports, "ChatModelsEnum", { enumerable: true, get: function () { return service_2.ChatModelsEnum; } });
    Object.defineProperty(exports, "ChatResponseFormatEnum", { enumerable: true, get: function () { return service_2.ChatResponseFormatEnum; } });
});
define("src/example/index", ["require", "exports", "react/jsx-runtime", "readline", "src/lib/index", "fs-extra", "path"], function (require, exports, jsx_runtime_6, readline_1, lib_1, fs, path_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout
    });
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
    const targetDir = './src/example/markdown/';
    getTree(targetDir).catch(console.error);
    class GPTWrapperWithTools {
        tools = [];
        children = [];
        getChildren = () => this.children;
        constructor(systemPromptJSX, tools = []) {
            this.tools = tools;
            console.log({ systemPromptJSX });
            this.children = [
                (0, jsx_runtime_6.jsx)(lib_1.System, { children: (0, lib_1.getString)(systemPromptJSX) })
            ];
            console.log({ children: this.children });
        }
        getChatCompletionComponent = () => {
            return (0, jsx_runtime_6.jsx)(lib_1.ChatCompletion, { tools: this.tools, children: this.children });
        };
        appendUserPromptJSX = (userPromptJSX) => {
            this.children.push(userPromptJSX);
        };
        getChatCompletion = async () => {
            const renderChatCompletion = (0, lib_1.getChatCompletionRenderer)(async (messages) => {
                const chatCompletionMessages = messages;
                return await (0, lib_1.getChatCompletion)(process.env.OPENAI_KEY, chatCompletionMessages, lib_1.ChatModelsEnum.GPT_3P5_TURBO_0125, lib_1.ChatResponseFormatEnum.JSON);
            });
            const chatCompletionComponent = this.getChatCompletionComponent();
            const chatCompletion = await renderChatCompletion(chatCompletionComponent);
            const { runTool, message } = chatCompletion;
            const { result } = await runTool();
            this.appendUserPromptJSX((0, jsx_runtime_6.jsx)(lib_1.Assistant, { children: result }));
            return {
                role: 'assistant',
                content: result,
            };
        };
    }
    const main = async () => {
        const tree = await getTree(targetDir);
        const gptWrapper = new GPTWrapperWithTools((0, jsx_runtime_6.jsxs)(lib_1.System, { children: ["# Your job is that of a librarian managing a repo of markdown text Below is a tree representation of the repo of MD/Markdown files:", tree] }), [
            {
                toolName: "Open a Markdown File",
                trigger: "for when you need to open the README.md file",
                command: "OPEN_MARKDOWN",
                params: { filePath: 'string' },
                execute: async ({ filePath }) => {
                    try {
                        const fileContents = await fs.readFileSync(`${targetDir}${filePath}`, 'utf-8');
                        return `Here is the contents of the file: \n\n${fileContents}`;
                    }
                    catch (error) {
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
                execute: async ({ fileName, fileContents }) => {
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
                execute: async ({ question }) => {
                    return `${question}`;
                }
            }
        ]);
        // gptWrapper.appendUserPromptJSX(<User>
        //   I want you to write a poem inside of the docs folder
        // </User>)
        // const message = await gptWrapper.getChatCompletion();
        function promptUser() {
            rl.question('Enter your command: ', async (command) => {
                // Here you can parse the command and interact with your GPTWrapperWithTools
                // For simplicity, let's just pass the command directly
                gptWrapper.appendUserPromptJSX((0, jsx_runtime_6.jsx)(lib_1.User, { children: command }));
                const message = await gptWrapper.getChatCompletion();
                console.log('Assistant says:', message.content);
                // Continue prompting the user after each interaction
                promptUser();
            });
        }
        // Start the CLI interaction
        promptUser();
        // console.log({message});
    };
    main().catch(console.error);
});
define("src/example/markdown/hello", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const sayHello = () => console.log('Hello, world!');
    module.exports = { sayHello };
});
// import * as React from 'react';
define("src/lib/execute", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
// import { OpenAI } from "../lib-old/openai";
// import { getString } from "../lib-old/utils";
// import { ChatModels, ChatModelsEnum, ChatResponseFormat, ChatResponseFormatEnum, getChatCompletion } from "./openai/service";
// import { findAllToolBoxes, getMessages, getToolBox } from './core';
// type JSXtoJSONRepresentation = {
//   model: ChatModels,
//   responseFormat: ChatResponseFormat,
//   toolBox: {[key: string]: ((...params: any) => any) | ((params?: any) => any)},
//   messages: {
//     role: string,
//     content: string,
//     name?: string,
//   }[],
// }
// export async function execute<T>(APIComponent: React.ReactElement): Promise<[string , { data: T | null }]> {
//   // Throw error if the component is not OpenAI.ChatCompletions and does not have OpenAI.Messages as a child
//   if (APIComponent.type !== OpenAI.ChatCompletions) throw new Error('The component must be OpenAI.ChatCompletions');
//   if (APIComponent.props.children.type !== OpenAI.Messages) throw new Error('The child of OpenAI.ChatCompletions must be OpenAI.Messages');
//   const apiComponent = APIComponent;
//   const ToolBoxes = findAllToolBoxes(apiComponent);
//   const toolBox: JSXtoJSONRepresentation['toolBox'] = ToolBoxes.map(tool => {
//     return getToolBox(tool);
//   })
//   .reduce((prevValue, currValue) => {
//     return {
//       ...prevValue,
//       ...currValue
//     }    
//   }, {});
//   // Get name of Model from OpenAI.ChatCompletions
//   const model = apiComponent.type === OpenAI.ChatCompletions ? apiComponent.props.model : ChatModelsEnum.GPT_3P5_TURBO;
//   const responseFormat = apiComponent.props.responseFormat
//   const apiKey = apiComponent.props.apiKey;
//   // Get Messages
//   const Messages = apiComponent.props.children;
//   const messages = getMessages(Messages);
//   const jsonRepresentation: JSXtoJSONRepresentation = {
//     model,
//     responseFormat,
//     toolBox,
//     messages, 
//   };
//   const completion = await getChatCompletion(apiKey, messages, model, responseFormat);
//   const runTool = (toolName: string, params: any) => {
//     // if toolBox is not null, then run the tool
//     const toolExecutionFunction = toolBox[toolName]; // This comes from the `execute` prop inside of the <Tool /> component
//     if (toolBox[toolName]) return toolExecutionFunction(params);
//   };
//   const content = completion.choices[0].message.content ?? '';
//   // If content can be parsed into JSON, then return the JSON object, else return the content
//   try {
//     // Parse the content into JSON
//     const parsedContent = JSON.parse(content);
//     // Check if the parsed content has a corresponding function key in the toolBox
//     if (toolBox[parsedContent.command]) {
//       // If it does, then return runTool
//       const result = await runTool(parsedContent.command, parsedContent.params);
//       return [
//         parsedContent.command as string,
//         { data: result as T }
//       ];
//     }
//   } catch (error) {
//     return [
//       content,
//       { data: null }
//     ];
//   }
//   return [
//     content,
//     { data: null }
//   ];
// };
define("src/lib/core/dumb-character-count", ["require", "exports", "react/jsx-runtime"], function (require, exports, jsx_runtime_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DumbCharacterCount = void 0;
    const DumbCharacterCount = ({ limit, children }) => {
        return limit === undefined ?
            children :
            children.length > limit ?
                (0, jsx_runtime_7.jsx)(jsx_runtime_7.Fragment, { children: `${children}` }) :
                null;
    };
    exports.DumbCharacterCount = DumbCharacterCount;
});
define("src/lib/core/types/models.enum", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tasks = exports.Models = void 0;
    var Models;
    (function (Models) {
        Models["BERT_BASE_UNCASED"] = "bert-base-uncased";
        Models["FACEBOOK_BART_LARGE_CNN"] = "facebook/bart-large-cnn";
        Models["DEEPSET_ROBERTA_BASE_SQUAD2"] = "deepset/roberta-base-squad2";
        Models["GOOGLE_TAPAS_BASE_FINETUNED_WTQ"] = "google/tapas-base-finetuned-wtq";
        Models["DISTILBERT_BASE_UNCASED_FINETUNED_SST_2_ENGLISH"] = "distilbert-base-uncased-finetuned-sst-2-english";
        Models["GPT2"] = "gpt2";
        Models["GOOGLE_FLAN_T5_XXL"] = "google/flan-t5-xxl";
        Models["DBMDZ_BERT_LARGE_CASED_FINETUNED_CONLL03_ENGLISH"] = "dbmdz/bert-large-cased-finetuned-conll03-english";
        Models["T5_BASE"] = "t5-base";
        Models["FACEBOOK_BART_LARGE_MNLI"] = "facebook/bart-large-mnli";
        Models["MICROSOFT_DIALOGPT_LARGE"] = "microsoft/DialoGPT-large";
        Models["SENTENCE_TRANSFORMERS_PARAPHRASE_XLM_R_MULTILINGUAL_V1"] = "sentence-transformers/paraphrase-xlm-r-multilingual-v1";
        Models["SENTENCE_TRANSFORMERS_DISTILBERT_BASE_NLI_MEAN_TOKENS"] = "sentence-transformers/distilbert-base-nli-mean-tokens";
        Models["FACEBOOK_WAV2VEC2_LARGE_960H_LV60_SELF"] = "facebook/wav2vec2-large-960h-lv60-self";
        Models["SUPERB_HUBERT_LARGE_SUPERB_ER"] = "superb/hubert-large-superb-er";
        Models["ESPNET_KAN_BAYASHI_LJSPEECH_VITS"] = "espnet/kan-bayashi_ljspeech_vits";
        Models["SPEECHBRAIN_SEPFORMER_WHAM"] = "speechbrain/sepformer-wham";
        Models["GOOGLE_VIT_BASE_PATCH16_224"] = "google/vit-base-patch16-224";
        Models["FACEBOOK_DETR_RESNET_50"] = "facebook/detr-resnet-50";
        Models["FACEBOOK_DETR_RESNET_50_PANOPTIC"] = "facebook/detr-resnet-50-panoptic";
        Models["STABILITYAI_STABLE_DIFFUSION_2"] = "stabilityai/stable-diffusion-2";
        Models["NLPCONNECT_VIT_GPT2_IMAGE_CAPTIONING"] = "nlpconnect/vit-gpt2-image-captioning";
        Models["LLLYASVIEL_SD_CONTROLNET_DEPTH"] = "lllyasviel/sd-controlnet-depth";
        Models["OPENAI_CLIP_VIT_LARGE_PATCH14_336"] = "openai/clip-vit-large-patch14-336";
        Models["DANDELIN_VILT_B32_FINETUNED_VQA"] = "dandelin/vilt-b32-finetuned-vqa";
        Models["IMPIRA_LAYOUTLM_DOCUMENT_QA"] = "impira/layoutlm-document-qa";
        Models["SCIKIT_LEARN_FISH_WEIGHT"] = "scikit-learn/Fish-Weight";
        Models["VVMNNNKV_WINE_QUALITY"] = "vvmnnnkv/wine-quality";
        Models["MY_CUSTOM_MODEL"] = "my-custom-model";
    })(Models || (exports.Models = Models = {}));
    var Tasks;
    (function (Tasks) {
        Tasks["FILL_MASK"] = "fillMask";
        Tasks["SUMMARIZATION"] = "summarization";
        Tasks["QUESTION_ANSWERING"] = "questionAnswering";
        Tasks["TABLE_QUESTION_ANSWERING"] = "tableQuestionAnswering";
        Tasks["TEXT_CLASSIFICATION"] = "textClassification";
        Tasks["TEXT_GENERATION"] = "textGeneration";
        Tasks["TOKEN_CLASSIFICATION"] = "tokenClassification";
        Tasks["TRANSLATION"] = "translation";
        Tasks["ZERO_SHOT_CLASSIFICATION"] = "zeroShotClassification";
        Tasks["CONVERSATIONAL"] = "conversational";
        Tasks["SENTENCE_SIMILARITY"] = "sentenceSimilarity";
        Tasks["FEATURE_EXTRACTION"] = "featureExtraction";
        Tasks["AUTOMATIC_SPEECH_RECOGNITION"] = "automaticSpeechRecognition";
        Tasks["AUDIO_CLASSIFICATION"] = "audioClassification";
        Tasks["TEXT_TO_SPEECH"] = "textToSpeech";
        Tasks["AUDIO_TO_AUDIO"] = "audioToAudio";
        Tasks["IMAGE_CLASSIFICATION"] = "imageClassification";
        Tasks["OBJECT_DETECTION"] = "objectDetection";
        Tasks["IMAGE_SEGMENTATION"] = "imageSegmentation";
        Tasks["TEXT_TO_IMAGE"] = "textToImage";
        Tasks["IMAGE_TO_TEXT"] = "imageToText";
        Tasks["IMAGE_TO_IMAGE"] = "imageToImage";
        Tasks["ZERO_SHOT_IMAGE_CLASSIFICATION"] = "zeroShotImageClassification";
        Tasks["VISUAL_QUESTION_ANSWERING"] = "visualQuestionAnswering";
        Tasks["DOCUMENT_QUESTION_ANSWERING"] = "documentQuestionAnswering";
        Tasks["TABULAR_REGRESSION"] = "tabularRegression";
        Tasks["TABULAR_CLASSIFICATION"] = "tabularClassification";
        Tasks["CUSTOM_TASK"] = "customTask";
    })(Tasks || (exports.Tasks = Tasks = {}));
});
define("src/lib/huggingface/index", ["require", "exports", "@huggingface/inference", "src/lib/core/types/models.enum"], function (require, exports, inference_1, models_enum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.executeHuggingfaceModel = void 0;
    const hf = new inference_1.HfInference(process.env.WEAVE__HUGGINGFACE_API_KEY);
    async function executeHuggingfaceModel(model, config) {
        switch (model) {
            case models_enum_1.Models.BERT_BASE_UNCASED:
                return await hf.fillMask({ model, ...config });
            case models_enum_1.Models.FACEBOOK_BART_LARGE_CNN:
                return await hf.summarization({ model, ...config });
            case models_enum_1.Models.DEEPSET_ROBERTA_BASE_SQUAD2:
                return await hf.questionAnswering({ model, ...config });
            case models_enum_1.Models.GOOGLE_TAPAS_BASE_FINETUNED_WTQ:
                return await hf.tableQuestionAnswering({ model, ...config });
            case models_enum_1.Models.DISTILBERT_BASE_UNCASED_FINETUNED_SST_2_ENGLISH:
                return await hf.textClassification({ model, ...config });
            case models_enum_1.Models.GPT2:
                return await hf.textGeneration({ model, ...config });
            case models_enum_1.Models.GOOGLE_FLAN_T5_XXL:
                // Assuming a generic API method exists for this model, as an example
                return await hf.textGenerationStream({ model, ...config });
            case models_enum_1.Models.DBMDZ_BERT_LARGE_CASED_FINETUNED_CONLL03_ENGLISH:
                return await hf.tokenClassification({ model, ...config });
            case models_enum_1.Models.T5_BASE:
                return await hf.translation({ model, ...config });
            case models_enum_1.Models.FACEBOOK_BART_LARGE_MNLI:
                return await hf.zeroShotClassification({ model, ...config });
            // Add additional cases for each model-task pairing as necessary
            case models_enum_1.Models.MICROSOFT_DIALOGPT_LARGE:
                return await hf.conversational({ model, ...config });
            case models_enum_1.Models.SENTENCE_TRANSFORMERS_PARAPHRASE_XLM_R_MULTILINGUAL_V1:
                return await hf.sentenceSimilarity({ model, ...config });
            case models_enum_1.Models.SENTENCE_TRANSFORMERS_DISTILBERT_BASE_NLI_MEAN_TOKENS:
                return await hf.featureExtraction({ model, ...config });
            // Assuming generic methods for audio, computer vision, and tabular data tasks
            case models_enum_1.Models.FACEBOOK_WAV2VEC2_LARGE_960H_LV60_SELF:
                // Simulated method for automatic speech recognition
                return await hf.automaticSpeechRecognition({ model, ...config });
            case models_enum_1.Models.SUPERB_HUBERT_LARGE_SUPERB_ER:
                // Simulated method for audio classification
                return await hf.audioClassification({ model, ...config });
            case models_enum_1.Models.ESPNET_KAN_BAYASHI_LJSPEECH_VITS:
                // Simulated method for text-to-speech
                return await hf.textToSpeech({ model, ...config });
            case models_enum_1.Models.GOOGLE_VIT_BASE_PATCH16_224:
                // Simulated method for image classification
                return await hf.imageClassification({ model, ...config });
            case models_enum_1.Models.FACEBOOK_DETR_RESNET_50:
                // Simulated method for object detection
                return await hf.objectDetection({ model, ...config });
            case models_enum_1.Models.FACEBOOK_DETR_RESNET_50_PANOPTIC:
                // Simulated method for image segmentation
                return await hf.imageSegmentation({ model, ...config });
            case models_enum_1.Models.STABILITYAI_STABLE_DIFFUSION_2:
                // Simulated method for text-to-image
                return await hf.textToImage({ model, ...config });
            case models_enum_1.Models.NLPCONNECT_VIT_GPT2_IMAGE_CAPTIONING:
                // Simulated method for image-to-text
                return await hf.imageToText({ model, ...config });
            case models_enum_1.Models.DANDELIN_VILT_B32_FINETUNED_VQA:
                // Simulated method for visual question answering
                return await hf.visualQuestionAnswering({ model, ...config });
            case models_enum_1.Models.IMPIRA_LAYOUTLM_DOCUMENT_QA:
                // Simulated method for document question answering
                return await hf.documentQuestionAnswering({ model, ...config });
            case models_enum_1.Models.SCIKIT_LEARN_FISH_WEIGHT:
                // Simulated method for tabular regression
                return await hf.tabularRegression({ model, ...config });
            case models_enum_1.Models.VVMNNNKV_WINE_QUALITY:
                // Simulated method for tabular classification
                return await hf.tabularClassification({ model, ...config });
            default:
                throw new Error("Model not supported or task not implemented.");
        }
    }
    exports.executeHuggingfaceModel = executeHuggingfaceModel;
});
define("src/lib/core/weave", ["require", "exports", "react/jsx-runtime", "src/lib/huggingface/index", "src/lib/core/types/models.enum", "src/lib/core/metadata"], function (require, exports, jsx_runtime_8, huggingface_1, models_enum_2, metadata_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExampleUsage = exports.ImageToText = exports.TextToImage = exports.ImageSegmentation = exports.ObjectDetection = exports.ImageClassification = exports.TextToSpeech = exports.AudioClassification = exports.AutomaticSpeechRecognition = exports.FeatureExtraction = exports.SentenceSimilarity = exports.Conversational = exports.ZeroShotClassification = exports.Translation = exports.TokenClassification = exports.TextGenerationStream = exports.TextGeneration = exports.TextClassification = exports.TableQuestionAnswering = exports.QuestionAnswering = exports.FillMask = exports.Summarization = exports.CoreModelConfig = void 0;
    const CoreModelConfig = ({ params, execute }) => {
        return ((0, jsx_runtime_8.jsx)(jsx_runtime_8.Fragment, { children: (0, jsx_runtime_8.jsx)(metadata_1.Metadata, { model: params.model, config: params.config, execute: execute }, params.model) }));
    };
    exports.CoreModelConfig = CoreModelConfig;
    const createModelComponent = (defaultModel) => {
        return ({ config }) => {
            const execute = async (configuration) => {
                return await (0, huggingface_1.executeHuggingfaceModel)(defaultModel, configuration);
            };
            return ((0, jsx_runtime_8.jsx)(exports.CoreModelConfig, { params: {
                    model: defaultModel,
                    config
                }, execute: execute }));
        };
    };
    exports.Summarization = createModelComponent(models_enum_2.Models.FACEBOOK_BART_LARGE_CNN);
    exports.FillMask = createModelComponent(models_enum_2.Models.BERT_BASE_UNCASED);
    exports.QuestionAnswering = createModelComponent(models_enum_2.Models.DEEPSET_ROBERTA_BASE_SQUAD2);
    exports.TableQuestionAnswering = createModelComponent(models_enum_2.Models.GOOGLE_TAPAS_BASE_FINETUNED_WTQ);
    exports.TextClassification = createModelComponent(models_enum_2.Models.DISTILBERT_BASE_UNCASED_FINETUNED_SST_2_ENGLISH);
    exports.TextGeneration = createModelComponent(models_enum_2.Models.GPT2);
    exports.TextGenerationStream = createModelComponent(models_enum_2.Models.GOOGLE_FLAN_T5_XXL);
    exports.TokenClassification = createModelComponent(models_enum_2.Models.DBMDZ_BERT_LARGE_CASED_FINETUNED_CONLL03_ENGLISH);
    exports.Translation = createModelComponent(models_enum_2.Models.T5_BASE);
    exports.ZeroShotClassification = createModelComponent(models_enum_2.Models.FACEBOOK_BART_LARGE_MNLI);
    exports.Conversational = createModelComponent(models_enum_2.Models.MICROSOFT_DIALOGPT_LARGE);
    exports.SentenceSimilarity = createModelComponent(models_enum_2.Models.SENTENCE_TRANSFORMERS_PARAPHRASE_XLM_R_MULTILINGUAL_V1);
    exports.FeatureExtraction = createModelComponent(models_enum_2.Models.SENTENCE_TRANSFORMERS_DISTILBERT_BASE_NLI_MEAN_TOKENS);
    exports.AutomaticSpeechRecognition = createModelComponent(models_enum_2.Models.FACEBOOK_WAV2VEC2_LARGE_960H_LV60_SELF);
    exports.AudioClassification = createModelComponent(models_enum_2.Models.SUPERB_HUBERT_LARGE_SUPERB_ER);
    exports.TextToSpeech = createModelComponent(models_enum_2.Models.ESPNET_KAN_BAYASHI_LJSPEECH_VITS);
    exports.ImageClassification = createModelComponent(models_enum_2.Models.GOOGLE_VIT_BASE_PATCH16_224);
    exports.ObjectDetection = createModelComponent(models_enum_2.Models.FACEBOOK_DETR_RESNET_50);
    exports.ImageSegmentation = createModelComponent(models_enum_2.Models.FACEBOOK_DETR_RESNET_50_PANOPTIC);
    exports.TextToImage = createModelComponent(models_enum_2.Models.STABILITYAI_STABLE_DIFFUSION_2);
    exports.ImageToText = createModelComponent(models_enum_2.Models.NLPCONNECT_VIT_GPT2_IMAGE_CAPTIONING);
    const ExampleUsage = () => {
        return ((0, jsx_runtime_8.jsx)(jsx_runtime_8.Fragment, { children: (0, jsx_runtime_8.jsx)(exports.FillMask, { config: {
                    inputs: 'The quick brown [MASK] jumps over the lazy dog',
                } }) }));
    };
    exports.ExampleUsage = ExampleUsage;
});
define("src/lib/openai/index", ["require", "exports", "react/jsx-runtime"], function (require, exports, jsx_runtime_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OpenAI = void 0;
    exports.OpenAI = {
        ChatCompletions: ({ apiKey, model, responseFormat, children }) => {
            return ((0, jsx_runtime_9.jsx)(jsx_runtime_9.Fragment, { children: children }));
        },
        Messages: ({ children }) => {
            return ((0, jsx_runtime_9.jsx)(jsx_runtime_9.Fragment, { children: children }));
        }
    };
});
