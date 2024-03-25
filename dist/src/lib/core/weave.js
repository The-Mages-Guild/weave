"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleUsage = exports.ImageToText = exports.TextToImage = exports.ImageSegmentation = exports.ObjectDetection = exports.ImageClassification = exports.TextToSpeech = exports.AudioClassification = exports.AutomaticSpeechRecognition = exports.FeatureExtraction = exports.SentenceSimilarity = exports.Conversational = exports.ZeroShotClassification = exports.Translation = exports.TokenClassification = exports.TextGenerationStream = exports.TextGeneration = exports.TextClassification = exports.TableQuestionAnswering = exports.QuestionAnswering = exports.FillMask = exports.Summarization = exports.CoreModelConfig = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const huggingface_1 = require("../huggingface");
const models_enum_1 = require("./types/models.enum");
const metadata_1 = require("./metadata");
const CoreModelConfig = ({ params, execute }) => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(metadata_1.Metadata, { model: params.model, config: params.config, execute: execute }, params.model) }));
};
exports.CoreModelConfig = CoreModelConfig;
const createModelComponent = (defaultModel) => {
    return ({ config }) => {
        const execute = async (configuration) => {
            return await (0, huggingface_1.executeHuggingfaceModel)(defaultModel, configuration);
        };
        return ((0, jsx_runtime_1.jsx)(exports.CoreModelConfig, { params: {
                model: defaultModel,
                config
            }, execute: execute }));
    };
};
exports.Summarization = createModelComponent(models_enum_1.Models.FACEBOOK_BART_LARGE_CNN);
exports.FillMask = createModelComponent(models_enum_1.Models.BERT_BASE_UNCASED);
exports.QuestionAnswering = createModelComponent(models_enum_1.Models.DEEPSET_ROBERTA_BASE_SQUAD2);
exports.TableQuestionAnswering = createModelComponent(models_enum_1.Models.GOOGLE_TAPAS_BASE_FINETUNED_WTQ);
exports.TextClassification = createModelComponent(models_enum_1.Models.DISTILBERT_BASE_UNCASED_FINETUNED_SST_2_ENGLISH);
exports.TextGeneration = createModelComponent(models_enum_1.Models.GPT2);
exports.TextGenerationStream = createModelComponent(models_enum_1.Models.GOOGLE_FLAN_T5_XXL);
exports.TokenClassification = createModelComponent(models_enum_1.Models.DBMDZ_BERT_LARGE_CASED_FINETUNED_CONLL03_ENGLISH);
exports.Translation = createModelComponent(models_enum_1.Models.T5_BASE);
exports.ZeroShotClassification = createModelComponent(models_enum_1.Models.FACEBOOK_BART_LARGE_MNLI);
exports.Conversational = createModelComponent(models_enum_1.Models.MICROSOFT_DIALOGPT_LARGE);
exports.SentenceSimilarity = createModelComponent(models_enum_1.Models.SENTENCE_TRANSFORMERS_PARAPHRASE_XLM_R_MULTILINGUAL_V1);
exports.FeatureExtraction = createModelComponent(models_enum_1.Models.SENTENCE_TRANSFORMERS_DISTILBERT_BASE_NLI_MEAN_TOKENS);
exports.AutomaticSpeechRecognition = createModelComponent(models_enum_1.Models.FACEBOOK_WAV2VEC2_LARGE_960H_LV60_SELF);
exports.AudioClassification = createModelComponent(models_enum_1.Models.SUPERB_HUBERT_LARGE_SUPERB_ER);
exports.TextToSpeech = createModelComponent(models_enum_1.Models.ESPNET_KAN_BAYASHI_LJSPEECH_VITS);
exports.ImageClassification = createModelComponent(models_enum_1.Models.GOOGLE_VIT_BASE_PATCH16_224);
exports.ObjectDetection = createModelComponent(models_enum_1.Models.FACEBOOK_DETR_RESNET_50);
exports.ImageSegmentation = createModelComponent(models_enum_1.Models.FACEBOOK_DETR_RESNET_50_PANOPTIC);
exports.TextToImage = createModelComponent(models_enum_1.Models.STABILITYAI_STABLE_DIFFUSION_2);
exports.ImageToText = createModelComponent(models_enum_1.Models.NLPCONNECT_VIT_GPT2_IMAGE_CAPTIONING);
const ExampleUsage = () => {
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(exports.FillMask, { config: {
                inputs: 'The quick brown [MASK] jumps over the lazy dog',
            } }) }));
};
exports.ExampleUsage = ExampleUsage;
