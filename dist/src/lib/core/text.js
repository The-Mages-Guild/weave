"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const markdown_1 = require("./markdown");
const Text = ({ children }) => ((0, jsx_runtime_1.jsx)(markdown_1.Markdown, { children: children }));
exports.Text = Text;
