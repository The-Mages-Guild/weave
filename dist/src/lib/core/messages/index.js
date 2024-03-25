"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.getMessageRole = exports.Assistant = exports.User = exports.System = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = require("react");
const utils_1 = require("../../utils");
const text_1 = require("../text");
const chat_completion_1 = require("../chat-completion");
const toolbox_1 = require("../toolbox");
const messageComponentStringify = (role, children, name) => {
    const string = (0, utils_1.getString)(children);
    return JSON.stringify({
        role: role,
        content: `${string}`,
        name
    });
};
const CoreMessage = ({ role, name, children }) => {
    const string = Array.isArray(children) ? children.join("") : (0, utils_1.getString)(children);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(text_1.Text, { children: messageComponentStringify(role, string, name) }) }));
};
const System = ({ name, children }) => {
    const { tools } = React.useContext(chat_completion_1.ToolContext);
    return ((0, jsx_runtime_1.jsxs)(CoreMessage, { role: "system", name: name, children: [children, tools && tools.map(({ toolName, trigger, command, params, execute }, index) => {
                return (0, utils_1.getString)((0, jsx_runtime_1.jsx)(toolbox_1.Tool, { toolName: toolName, trigger: trigger, command: command, params: params, execute: execute }, index));
            })] }));
};
exports.System = System;
const User = ({ name, children }) => {
    return ((0, jsx_runtime_1.jsx)(CoreMessage, { role: "user", name: name, children: children }));
};
exports.User = User;
const Assistant = ({ name, children }) => {
    return ((0, jsx_runtime_1.jsx)(CoreMessage, { role: "assistant", name: name, children: children }));
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
                    content: `${(0, utils_1.getString)(child.props.children)}`,
                    name,
                };
            }
            return {
                role: (0, exports.getMessageRole)(child),
                content: `${(0, utils_1.getString)(child.props.children)}`,
            };
        }
    });
};
exports.getMessages = getMessages;
