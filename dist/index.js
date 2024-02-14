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
define("src/lib/core/messages/index", ["require", "exports", "react/jsx-runtime", "react", "src/lib/utils/index", "src/lib/core/text"], function (require, exports, jsx_runtime_3, React, utils_1, text_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getMessages = exports.getMessageRole = exports.Assistant = exports.User = exports.System = void 0;
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
        return ((0, jsx_runtime_3.jsx)(text_1.Text, { children: messageComponentStringify(role, string, name) }));
    };
    const System = ({ name, children }) => {
        return ((0, jsx_runtime_3.jsx)(CoreMessage, { role: "system", name: name, children: children }));
    };
    exports.System = System;
    const User = ({ name, children }) => {
        return ((0, jsx_runtime_3.jsx)(CoreMessage, { role: "user", name: name, children: children }));
    };
    exports.User = User;
    const Assistant = ({ name, children }) => {
        return ((0, jsx_runtime_3.jsx)(CoreMessage, { role: "assistant", name: name, children: children }));
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
});
define("src/lib/core/toolbox/index", ["require", "exports", "react/jsx-runtime", "react", "src/lib/core/text"], function (require, exports, jsx_runtime_4, React, text_2) {
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
        return ((0, jsx_runtime_4.jsxs)(text_2.Text, { children: ["=== Tool: [", toolName, "] === Trigger: ", trigger, "You must respond with the following JSON object as your command to the app:", JSON.stringify(favouredJSON, null, 2), "=== [/", toolName, "] ==="] }));
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
define("src/lib/core/index", ["require", "exports", "src/lib/core/text", "src/lib/core/markdown", "src/lib/core/messages/index", "src/lib/core/toolbox/index"], function (require, exports, text_3, markdown_2, messages_1, toolbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getToolBox = exports.findAllToolBoxes = exports.Tool = exports.ToolBox = exports.getMessages = exports.getMessageRole = exports.Assistant = exports.User = exports.System = exports.Markdown = exports.Text = void 0;
    Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return text_3.Text; } });
    Object.defineProperty(exports, "Markdown", { enumerable: true, get: function () { return markdown_2.Markdown; } });
    Object.defineProperty(exports, "System", { enumerable: true, get: function () { return messages_1.System; } });
    Object.defineProperty(exports, "User", { enumerable: true, get: function () { return messages_1.User; } });
    Object.defineProperty(exports, "Assistant", { enumerable: true, get: function () { return messages_1.Assistant; } });
    Object.defineProperty(exports, "getMessageRole", { enumerable: true, get: function () { return messages_1.getMessageRole; } });
    Object.defineProperty(exports, "getMessages", { enumerable: true, get: function () { return messages_1.getMessages; } });
    Object.defineProperty(exports, "ToolBox", { enumerable: true, get: function () { return toolbox_1.ToolBox; } });
    Object.defineProperty(exports, "Tool", { enumerable: true, get: function () { return toolbox_1.Tool; } });
    Object.defineProperty(exports, "findAllToolBoxes", { enumerable: true, get: function () { return toolbox_1.findAllToolBoxes; } });
    Object.defineProperty(exports, "getToolBox", { enumerable: true, get: function () { return toolbox_1.getToolBox; } });
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
define("src/lib/openai/index", ["require", "exports", "react/jsx-runtime"], function (require, exports, jsx_runtime_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OpenAI = void 0;
    exports.OpenAI = {
        ChatCompletions: ({ apiKey, model, responseFormat, children }) => {
            return ((0, jsx_runtime_5.jsx)(jsx_runtime_5.Fragment, { children: children }));
        },
        Messages: ({ children }) => {
            return ((0, jsx_runtime_5.jsx)(jsx_runtime_5.Fragment, { children: children }));
        }
    };
});
define("src/lib/execute", ["require", "exports", "src/lib/openai/index", "src/lib/openai/service/index", "src/lib/core/index"], function (require, exports, openai_2, service_1, core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.execute = void 0;
    async function execute(APIComponent) {
        // Throw error if the component is not OpenAI.ChatCompletions and does not have OpenAI.Messages as a child
        if (APIComponent.type !== openai_2.OpenAI.ChatCompletions)
            throw new Error('The component must be OpenAI.ChatCompletions');
        if (APIComponent.props.children.type !== openai_2.OpenAI.Messages)
            throw new Error('The child of OpenAI.ChatCompletions must be OpenAI.Messages');
        const apiComponent = APIComponent;
        const ToolBoxes = (0, core_1.findAllToolBoxes)(apiComponent);
        const toolBox = ToolBoxes.map(tool => {
            return (0, core_1.getToolBox)(tool);
        })
            .reduce((prevValue, currValue) => {
            return {
                ...prevValue,
                ...currValue
            };
        }, {});
        // Get name of Model from OpenAI.ChatCompletions
        const model = apiComponent.type === openai_2.OpenAI.ChatCompletions ? apiComponent.props.model : service_1.ChatModelsEnum.GPT_3P5_TURBO;
        const responseFormat = apiComponent.props.responseFormat;
        const apiKey = apiComponent.props.apiKey;
        // Get Messages
        const Messages = apiComponent.props.children;
        const messages = (0, core_1.getMessages)(Messages);
        const jsonRepresentation = {
            model,
            responseFormat,
            toolBox,
            messages,
        };
        const completion = await (0, service_1.getChatCompletion)(apiKey, messages, model, responseFormat);
        const runTool = (toolName, params) => {
            // if toolBox is not null, then run the tool
            const toolExecutionFunction = toolBox[toolName]; // This comes from the `execute` prop inside of the <Tool /> component
            if (toolBox[toolName])
                return toolExecutionFunction(params);
        };
        const content = completion.choices[0].message.content ?? '';
        // If content can be parsed into JSON, then return the JSON object, else return the content
        try {
            // Parse the content into JSON
            const parsedContent = JSON.parse(content);
            // Check if the parsed content has a corresponding function key in the toolBox
            if (toolBox[parsedContent.command]) {
                // If it does, then return runTool
                const result = await runTool(parsedContent.command, parsedContent.params);
                return [
                    parsedContent.command,
                    { data: result }
                ];
            }
        }
        catch (error) {
            return [
                content,
                { data: null }
            ];
        }
        return [
            content,
            { data: null }
        ];
    }
    exports.execute = execute;
    ;
});
define("src/lib/index", ["require", "exports", "src/lib/execute", "src/lib/utils/index", "src/lib/core/index", "src/lib/openai/index"], function (require, exports, execute_1, utils_2, core_2, openai_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OpenAI = exports.getToolBox = exports.findAllToolBoxes = exports.Tool = exports.ToolBox = exports.getMessages = exports.getMessageRole = exports.Assistant = exports.User = exports.System = exports.Markdown = exports.Text = exports.getString = exports.execute = void 0;
    Object.defineProperty(exports, "execute", { enumerable: true, get: function () { return execute_1.execute; } });
    Object.defineProperty(exports, "getString", { enumerable: true, get: function () { return utils_2.getString; } });
    Object.defineProperty(exports, "Text", { enumerable: true, get: function () { return core_2.Text; } });
    Object.defineProperty(exports, "Markdown", { enumerable: true, get: function () { return core_2.Markdown; } });
    Object.defineProperty(exports, "System", { enumerable: true, get: function () { return core_2.System; } });
    Object.defineProperty(exports, "User", { enumerable: true, get: function () { return core_2.User; } });
    Object.defineProperty(exports, "Assistant", { enumerable: true, get: function () { return core_2.Assistant; } });
    Object.defineProperty(exports, "getMessageRole", { enumerable: true, get: function () { return core_2.getMessageRole; } });
    Object.defineProperty(exports, "getMessages", { enumerable: true, get: function () { return core_2.getMessages; } });
    Object.defineProperty(exports, "ToolBox", { enumerable: true, get: function () { return core_2.ToolBox; } });
    Object.defineProperty(exports, "Tool", { enumerable: true, get: function () { return core_2.Tool; } });
    Object.defineProperty(exports, "findAllToolBoxes", { enumerable: true, get: function () { return core_2.findAllToolBoxes; } });
    Object.defineProperty(exports, "getToolBox", { enumerable: true, get: function () { return core_2.getToolBox; } });
    Object.defineProperty(exports, "OpenAI", { enumerable: true, get: function () { return openai_3.OpenAI; } });
});
define("src/example/index", ["require", "exports", "react/jsx-runtime", "src/lib/core/index", "src/lib/index", "src/lib/openai/service/index", "src/lib/openai/index", "src/lib/core/index", "src/lib/core/text"], function (require, exports, jsx_runtime_6, core_3, lib_1, service_2, openai_4, core_4, text_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const main = async () => {
        const [content, toolResult] = await (0, lib_1.execute)((0, jsx_runtime_6.jsx)(openai_4.OpenAI.ChatCompletions, { model: service_2.ChatModelsEnum.GPT_3P5_TURBO_0125, responseFormat: service_2.ChatResponseFormatEnum.JSON, apiKey: process.env.OPENAI_KEY, children: (0, jsx_runtime_6.jsxs)(openai_4.OpenAI.Messages, { children: [(0, jsx_runtime_6.jsx)(core_4.System, { children: (0, jsx_runtime_6.jsx)(core_3.ToolBox, { children: (0, jsx_runtime_6.jsx)(core_3.Tool, { toolName: "Fetch Weather Data", trigger: "for when you need to fetch real-time weather data", command: "FETCH_WEATHER_DATA", params: { city: "string" }, execute: async ({ city }) => {
                                    try {
                                        const response = await fetch(`https://api.weatherapi.com/v1/current.json?q=${city}`);
                                        const data = await response.json();
                                        return `Current weather in ${city}: ${data.current.temp_c}°C, ${data.current.condition.text}`;
                                    }
                                    catch (error) {
                                        return `Failed to fetch weather data for ${city}`;
                                    }
                                } }) }) }), (0, jsx_runtime_6.jsxs)(core_4.User, { name: "Bobbert", children: [(0, jsx_runtime_6.jsx)(text_4.Text, { children: "Hi my name is Bobbert and these are the tools you can use with me. Help me out here, can you respond with ONLY a variation of the following JSON object?" }), (0, jsx_runtime_6.jsx)(core_3.ToolBox, { children: (0, jsx_runtime_6.jsx)(core_3.Tool, { toolName: "Check The Sports", trigger: "when you need to check the sports points", command: "CHECK_SPORTS", params: {
                                        sportsLeague: "string",
                                        teams: "string[]"
                                    }, execute: ({ sportsLeague, teams }) => {
                                        return `Checking the sports in ${sportsLeague} for ${teams}`;
                                    } }) })] }), (0, jsx_runtime_6.jsx)(core_4.Assistant, { children: "Thank you! I will use this tool." }), (0, jsx_runtime_6.jsx)(core_4.User, { children: (0, jsx_runtime_6.jsx)(text_4.Text, { children: "What's the weather in Brampton right now?" }) })] }) }));
        console.log('content', content);
        console.log('result', toolResult.data);
    };
    main();
});
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
