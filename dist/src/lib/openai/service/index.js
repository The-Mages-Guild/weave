"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatCompletion = exports.ChatResponseFormatEnum = exports.ChatModelsEnum = void 0;
const openai_1 = require("openai");
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
