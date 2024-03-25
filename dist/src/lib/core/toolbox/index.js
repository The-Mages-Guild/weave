"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToolBox = exports.findAllToolBoxes = exports.Tool = exports.ToolBox = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = require("react");
const text_1 = require("../text");
const ToolBox = ({ children }) => {
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
};
exports.ToolBox = ToolBox;
const Tool = ({ toolName, trigger, command, params, execute }) => {
    const favouredJSON = {
        command: command,
        params: params,
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(text_1.Text, { children: ["=== Tool: [", toolName, "] === Trigger: ", trigger, "You must respond with the following JSON object as your command to the app:", JSON.stringify(favouredJSON, null, 2), "=== [/", toolName, "] ==="] }) }));
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
