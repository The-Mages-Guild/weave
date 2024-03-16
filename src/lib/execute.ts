// import * as React from 'react';

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