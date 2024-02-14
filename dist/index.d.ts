declare module "src/lib/core/markdown" {
    import * as React from 'react';
    export interface IMarkdown {
        children: string[] | string | React.ReactNode | React.ReactNode[];
    }
    export const Markdown: ({ children }: IMarkdown) => import("react/jsx-runtime").JSX.Element;
}
declare module "src/lib/core/text" {
    import * as React from 'react';
    export interface IText {
        children: string[] | string | React.ReactNode | React.ReactNode[];
    }
    export const Text: ({ children }: IText) => import("react/jsx-runtime").JSX.Element;
}
declare module "src/lib/utils/index" {
    export const getString: (component: React.ReactNode) => string;
}
declare module "src/lib/core/messages/index" {
    import * as React from 'react';
    export interface IMessage {
        children: string[] | string | React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[];
        name?: string;
    }
    export const System: ({ name, children }: IMessage) => import("react/jsx-runtime").JSX.Element;
    export const User: ({ name, children }: IMessage) => import("react/jsx-runtime").JSX.Element;
    export const Assistant: ({ name, children }: IMessage) => import("react/jsx-runtime").JSX.Element;
    export const getMessageRole: (child: React.ReactElement) => "system" | "user" | "assistant";
    export const getMessages: (jsxMessagesComponent: React.ReactElement) => any;
}
declare module "src/lib/core/toolbox/index" {
    import * as React from 'react';
    export interface IToolBox {
        children: string[] | string | React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[];
    }
    export const ToolBox: ({ children }: IToolBox) => import("react/jsx-runtime").JSX.Element;
    export interface ITool {
        toolName: string;
        trigger: string;
        command: string;
        params: {};
        execute: (params: any) => any;
    }
    export const Tool: ({ toolName, trigger, command, params, execute }: ITool) => import("react/jsx-runtime").JSX.Element;
    export type ToolBoxElement = React.ReactElement<IToolBox>;
    export function findAllToolBoxes(element: React.ReactNode, toolBoxes?: ToolBoxElement[]): ToolBoxElement[];
    export const getToolBox: (jsxToolBoxComponent: React.ReactElement) => {};
}
declare module "src/lib/core/index" {
    export { Text } from "src/lib/core/text";
    export { Markdown } from "src/lib/core/markdown";
    export { System, User, Assistant, getMessageRole, getMessages } from "src/lib/core/messages/index";
    export { ToolBox, Tool, findAllToolBoxes, getToolBox } from "src/lib/core/toolbox/index";
}
declare module "src/lib/openai/service/index" {
    import OpenAI from 'openai';
    export enum ChatModelsEnum {
        GPT_3P5_TURBO = "gpt-3.5-turbo",
        GPT_3P5_TURBO_0125 = "gpt-3.5-turbo-0125",
        GPT_4_0125_PREVIEW = "gpt-4-0125-preview"
    }
    export enum ChatResponseFormatEnum {
        JSON = "json_object",
        TEXT = "text"
    }
    export type ChatModels = ChatModelsEnum.GPT_3P5_TURBO | ChatModelsEnum.GPT_3P5_TURBO_0125 | ChatModelsEnum.GPT_4_0125_PREVIEW;
    export type ChatResponseFormat = ChatResponseFormatEnum.JSON | ChatResponseFormatEnum.TEXT;
    export const getChatCompletion: (apiKey: string, messages: OpenAI.ChatCompletionMessage[], model: ChatModels, responseFormat?: ChatResponseFormat) => Promise<OpenAI.Chat.Completions.ChatCompletion>;
}
declare module "src/lib/openai/index" {
    import { ChatModels, ChatResponseFormatEnum } from "src/lib/openai/service/index";
    export interface IOpenAI {
        children: React.ReactElement[];
    }
    export interface IOpenAIChatCompletions {
        apiKey: string | undefined;
        model: ChatModels;
        responseFormat: ChatResponseFormatEnum;
        children: React.ReactElement;
    }
    export const OpenAI: {
        ChatCompletions: ({ apiKey, model, responseFormat, children }: IOpenAIChatCompletions) => import("react/jsx-runtime").JSX.Element;
        Messages: ({ children }: {
            children: React.ReactElement[];
        }) => import("react/jsx-runtime").JSX.Element;
    };
}
declare module "src/lib/execute" {
    import * as React from 'react';
    export function execute<T>(APIComponent: React.ReactElement): Promise<[string, {
        data: T | null;
    }]>;
}
declare module "src/lib/index" {
    export { execute } from "src/lib/execute";
    export { getString } from "src/lib/utils/index";
    export { Text, Markdown, System, User, Assistant, getMessageRole, getMessages, ToolBox, Tool, findAllToolBoxes, getToolBox } from "src/lib/core/index";
    export { OpenAI } from "src/lib/openai/index";
}
declare module "src/example/index" {
    export const main: () => Promise<void>;
}
declare module "src/lib/core/dumb-character-count" {
    interface IDumbCharacterCount {
        limit?: number;
        children: string;
    }
    export const DumbCharacterCount: ({ limit, children }: IDumbCharacterCount) => string | import("react/jsx-runtime").JSX.Element | null;
}
