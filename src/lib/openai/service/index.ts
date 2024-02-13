import OpenAI from 'openai';

export enum ChatModelsEnum {
  GPT_3P5_TURBO = 'gpt-3.5-turbo',
  GPT_3P5_TURBO_0125 = 'gpt-3.5-turbo-0125',
  GPT_4_0125_PREVIEW = 'gpt-4-0125-preview',
}

export enum ChatResponseFormatEnum {
  JSON = 'json_object',
  TEXT = 'text',
}

export type ChatModels = ChatModelsEnum.GPT_3P5_TURBO | ChatModelsEnum.GPT_3P5_TURBO_0125 | ChatModelsEnum.GPT_4_0125_PREVIEW;

export type ChatResponseFormat = ChatResponseFormatEnum.JSON | ChatResponseFormatEnum.TEXT;

export const getChatCompletion = async (apiKey: string, messages: OpenAI.ChatCompletionMessage[], model: ChatModels, responseFormat?: ChatResponseFormat) => {
  if (!apiKey) throw new Error('No API Key provided in <OpenAI.ChatCompletions />');
  if (model === ChatModelsEnum.GPT_3P5_TURBO && responseFormat !== undefined) {
    throw new Error(`${responseFormat} does not support response format`);
  }

  const openai = new OpenAI({
    apiKey
  });

  if (responseFormat === ChatResponseFormatEnum.JSON) {
    const chatCompletion = await openai.chat.completions.create({
      messages,
      model: model as string,
      response_format: { type: responseFormat },
    });
    return chatCompletion;
  }
  const chatCompletion = await openai.chat.completions.create({
    messages,
    model: model as string
  });
  return chatCompletion;

}
