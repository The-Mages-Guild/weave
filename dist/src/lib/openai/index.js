"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAI = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
exports.OpenAI = {
    ChatCompletions: ({ apiKey, model, responseFormat, children }) => {
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children }));
    },
    Messages: ({ children }) => {
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children }));
    }
};
