import * as React from 'react';
interface ITool<T = any> {
    toolName: string;
    trigger: string;
    command: string;
    params: Record<string, string>;
    execute: (params: Record<string, string>) => Promise<T>;
}
interface IBaseChat {
    tools: ITool[];
    children: React.ReactNode;
}
export declare const ToolContext: React.Context<{
    tools: ITool[];
}>;
export declare const ChatCompletion: ({ tools, children }: IBaseChat) => import("react/jsx-runtime").JSX.Element;
export declare const getChatCompletionRenderer: (chatCompletionCallback: (messages: any) => Promise<any>) => (jsxChatCompletionComponent: React.ReactElement) => Promise<{
    runTool: () => Promise<{
        type: any;
        result: any;
    }>;
    message: any;
}>;
export {};
