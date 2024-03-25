"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatCompletionRenderer = exports.ChatCompletion = exports.ToolContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = require("react");
const utils_1 = require("../utils");
exports.ToolContext = React.createContext({ tools: [] });
const ToolsProvider = ({ children, tools }) => {
    return (0, jsx_runtime_1.jsx)(exports.ToolContext.Provider, { value: { tools }, children: children });
};
const Chat = ({ tools, children }) => {
    const messages = React.Children.map(children, child => {
        const data = (0, utils_1.getString)((0, jsx_runtime_1.jsx)(ToolsProvider, { tools: tools, children: child }));
        return JSON.parse(data);
    });
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: JSON.stringify(messages) });
};
const ChatCompletion = ({ tools, children }) => {
    const messages = (0, utils_1.getString)((0, jsx_runtime_1.jsx)(Chat, { tools: tools, children: children }));
    const parsedMessages = JSON.parse(messages);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: JSON.stringify(parsedMessages) });
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
