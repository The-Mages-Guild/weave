"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Markdown = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = require("react");
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
