"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DumbCharacterCount = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const DumbCharacterCount = ({ limit, children }) => {
    return limit === undefined ?
        children :
        children.length > limit ?
            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: `${children}` }) :
            null;
};
exports.DumbCharacterCount = DumbCharacterCount;
