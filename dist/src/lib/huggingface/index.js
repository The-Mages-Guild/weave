"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeHuggingfaceModel = void 0;
const inference_1 = require("@huggingface/inference");
const models_enum_1 = require("../core/types/models.enum");
const hf = new inference_1.HfInference(process.env.WEAVE__HUGGINGFACE_API_KEY);
async function executeHuggingfaceModel(model, config) {
    switch (model) {
        case models_enum_1.Models.BERT_BASE_UNCASED:
            return await hf.fillMask({ model, ...config });
        case models_enum_1.Models.FACEBOOK_BART_LARGE_CNN:
            return await hf.summarization({ model, ...config });
        case models_enum_1.Models.DEEPSET_ROBERTA_BASE_SQUAD2:
            return await hf.questionAnswering({ model, ...config });
        case models_enum_1.Models.GOOGLE_TAPAS_BASE_FINETUNED_WTQ:
            return await hf.tableQuestionAnswering({ model, ...config });
        case models_enum_1.Models.DISTILBERT_BASE_UNCASED_FINETUNED_SST_2_ENGLISH:
            return await hf.textClassification({ model, ...config });
        case models_enum_1.Models.GPT2:
            return await hf.textGeneration({ model, ...config });
        case models_enum_1.Models.GOOGLE_FLAN_T5_XXL:
            // Assuming a generic API method exists for this model, as an example
            return await hf.textGenerationStream({ model, ...config });
        case models_enum_1.Models.DBMDZ_BERT_LARGE_CASED_FINETUNED_CONLL03_ENGLISH:
            return await hf.tokenClassification({ model, ...config });
        case models_enum_1.Models.T5_BASE:
            return await hf.translation({ model, ...config });
        case models_enum_1.Models.FACEBOOK_BART_LARGE_MNLI:
            return await hf.zeroShotClassification({ model, ...config });
        // Add additional cases for each model-task pairing as necessary
        case models_enum_1.Models.MICROSOFT_DIALOGPT_LARGE:
            return await hf.conversational({ model, ...config });
        case models_enum_1.Models.SENTENCE_TRANSFORMERS_PARAPHRASE_XLM_R_MULTILINGUAL_V1:
            return await hf.sentenceSimilarity({ model, ...config });
        case models_enum_1.Models.SENTENCE_TRANSFORMERS_DISTILBERT_BASE_NLI_MEAN_TOKENS:
            return await hf.featureExtraction({ model, ...config });
        // Assuming generic methods for audio, computer vision, and tabular data tasks
        case models_enum_1.Models.FACEBOOK_WAV2VEC2_LARGE_960H_LV60_SELF:
            // Simulated method for automatic speech recognition
            return await hf.automaticSpeechRecognition({ model, ...config });
        case models_enum_1.Models.SUPERB_HUBERT_LARGE_SUPERB_ER:
            // Simulated method for audio classification
            return await hf.audioClassification({ model, ...config });
        case models_enum_1.Models.ESPNET_KAN_BAYASHI_LJSPEECH_VITS:
            // Simulated method for text-to-speech
            return await hf.textToSpeech({ model, ...config });
        case models_enum_1.Models.GOOGLE_VIT_BASE_PATCH16_224:
            // Simulated method for image classification
            return await hf.imageClassification({ model, ...config });
        case models_enum_1.Models.FACEBOOK_DETR_RESNET_50:
            // Simulated method for object detection
            return await hf.objectDetection({ model, ...config });
        case models_enum_1.Models.FACEBOOK_DETR_RESNET_50_PANOPTIC:
            // Simulated method for image segmentation
            return await hf.imageSegmentation({ model, ...config });
        case models_enum_1.Models.STABILITYAI_STABLE_DIFFUSION_2:
            // Simulated method for text-to-image
            return await hf.textToImage({ model, ...config });
        case models_enum_1.Models.NLPCONNECT_VIT_GPT2_IMAGE_CAPTIONING:
            // Simulated method for image-to-text
            return await hf.imageToText({ model, ...config });
        case models_enum_1.Models.DANDELIN_VILT_B32_FINETUNED_VQA:
            // Simulated method for visual question answering
            return await hf.visualQuestionAnswering({ model, ...config });
        case models_enum_1.Models.IMPIRA_LAYOUTLM_DOCUMENT_QA:
            // Simulated method for document question answering
            return await hf.documentQuestionAnswering({ model, ...config });
        case models_enum_1.Models.SCIKIT_LEARN_FISH_WEIGHT:
            // Simulated method for tabular regression
            return await hf.tabularRegression({ model, ...config });
        case models_enum_1.Models.VVMNNNKV_WINE_QUALITY:
            // Simulated method for tabular classification
            return await hf.tabularClassification({ model, ...config });
        default:
            throw new Error("Model not supported or task not implemented.");
    }
}
exports.executeHuggingfaceModel = executeHuggingfaceModel;
