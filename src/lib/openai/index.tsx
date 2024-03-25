import { ChatModels, ChatModelsEnum, ChatResponseFormat, ChatResponseFormatEnum } from "./service";


//** Open AI */
export interface IOpenAI {
  children: React.ReactElement[];
}

export interface IOpenAIChatCompletions {
  apiKey: string | undefined;
  model: ChatModels;
  responseFormat: ChatResponseFormatEnum;
  children: React.ReactElement;
}

export const OpenAI = {
    ChatCompletions: ({ apiKey, model, responseFormat, children }: IOpenAIChatCompletions) => {
      return (
        <>{children}</>
      )
    },
    Messages: ({ children }: { children: React.ReactElement[] }) => {
      return (
        <>{children}</>
      )
    }
};

