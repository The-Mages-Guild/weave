import { ChatModels, ChatResponseFormatEnum } from "./service";
export interface IOpenAI {
    children: React.ReactElement[];
}
export interface IOpenAIChatCompletions {
    apiKey: string | undefined;
    model: ChatModels;
    responseFormat: ChatResponseFormatEnum;
    children: React.ReactElement;
}
export declare const OpenAI: {
    ChatCompletions: ({ apiKey, model, responseFormat, children }: IOpenAIChatCompletions) => import("react/jsx-runtime").JSX.Element;
    Messages: ({ children }: {
        children: React.ReactElement[];
    }) => import("react/jsx-runtime").JSX.Element;
};
