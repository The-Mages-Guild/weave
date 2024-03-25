import OpenAI from 'openai';
export declare enum ChatModelsEnum {
    GPT_3P5_TURBO = "gpt-3.5-turbo",
    GPT_3P5_TURBO_0125 = "gpt-3.5-turbo-0125",
    GPT_4_0125_PREVIEW = "gpt-4-0125-preview"
}
export declare enum ChatResponseFormatEnum {
    JSON = "json_object",
    TEXT = "text"
}
export type ChatModels = ChatModelsEnum.GPT_3P5_TURBO | ChatModelsEnum.GPT_3P5_TURBO_0125 | ChatModelsEnum.GPT_4_0125_PREVIEW;
export type ChatResponseFormat = ChatResponseFormatEnum.JSON | ChatResponseFormatEnum.TEXT;
export declare const getChatCompletion: (apiKey: string, messages: OpenAI.ChatCompletionMessage[], model: ChatModels, responseFormat?: ChatResponseFormat) => Promise<OpenAI.Chat.Completions.ChatCompletion>;
