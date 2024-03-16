import { HfInference } from '@huggingface/inference'
import { Models, ResolveTaskInput, ModelToTaskMap, TaskInputMap } from '../core/types/models.enum';

const hf = new HfInference(process.env.WEAVE__HUGGINGFACE_API_KEY)

export async function executeHuggingfaceModel<M extends Models>(model: M, config: ResolveTaskInput<M>) {
  switch (model) {
    case Models.BERT_BASE_UNCASED:
      return await hf.fillMask({model, ...config as TaskInputMap[ModelToTaskMap[Models.BERT_BASE_UNCASED]]});
    case Models.FACEBOOK_BART_LARGE_CNN:
      return await hf.summarization({model, ...config as TaskInputMap[ModelToTaskMap[Models.FACEBOOK_BART_LARGE_CNN]]});
    case Models.DEEPSET_ROBERTA_BASE_SQUAD2:
      return await hf.questionAnswering({model, ...config as TaskInputMap[ModelToTaskMap[Models.DEEPSET_ROBERTA_BASE_SQUAD2]]});
    case Models.GOOGLE_TAPAS_BASE_FINETUNED_WTQ:
      return await hf.tableQuestionAnswering({model, ...config as TaskInputMap[ModelToTaskMap[Models.GOOGLE_TAPAS_BASE_FINETUNED_WTQ]]});
    case Models.DISTILBERT_BASE_UNCASED_FINETUNED_SST_2_ENGLISH:
      return await hf.textClassification({model, ...config as TaskInputMap[ModelToTaskMap[Models.DISTILBERT_BASE_UNCASED_FINETUNED_SST_2_ENGLISH]]});
    case Models.GPT2:
      return await hf.textGeneration({model, ...config as TaskInputMap[ModelToTaskMap[Models.GPT2]]});
    case Models.GOOGLE_FLAN_T5_XXL:
      // Assuming a generic API method exists for this model, as an example
      return await hf.textGenerationStream({model, ...config as TaskInputMap[ModelToTaskMap[Models.GOOGLE_FLAN_T5_XXL]]});
    case Models.DBMDZ_BERT_LARGE_CASED_FINETUNED_CONLL03_ENGLISH:
      return await hf.tokenClassification({model, ...config as TaskInputMap[ModelToTaskMap[Models.DBMDZ_BERT_LARGE_CASED_FINETUNED_CONLL03_ENGLISH]]});
    case Models.T5_BASE:
      return await hf.translation({model, ...config as TaskInputMap[ModelToTaskMap[Models.T5_BASE]]});
    case Models.FACEBOOK_BART_LARGE_MNLI:
      return await hf.zeroShotClassification({model, ...config as TaskInputMap[ModelToTaskMap[Models.FACEBOOK_BART_LARGE_MNLI]]});
    // Add additional cases for each model-task pairing as necessary
    case Models.MICROSOFT_DIALOGPT_LARGE:
        return await hf.conversational({model, ...config as TaskInputMap[ModelToTaskMap[Models.MICROSOFT_DIALOGPT_LARGE]]});
    case Models.SENTENCE_TRANSFORMERS_PARAPHRASE_XLM_R_MULTILINGUAL_V1:
        return await hf.sentenceSimilarity({model, ...config as TaskInputMap[ModelToTaskMap[Models.SENTENCE_TRANSFORMERS_PARAPHRASE_XLM_R_MULTILINGUAL_V1]]});
    case Models.SENTENCE_TRANSFORMERS_DISTILBERT_BASE_NLI_MEAN_TOKENS:
        return await hf.featureExtraction({model, ...config as TaskInputMap[ModelToTaskMap[Models.SENTENCE_TRANSFORMERS_DISTILBERT_BASE_NLI_MEAN_TOKENS]]});
    // Assuming generic methods for audio, computer vision, and tabular data tasks
    case Models.FACEBOOK_WAV2VEC2_LARGE_960H_LV60_SELF:
        // Simulated method for automatic speech recognition
        return await hf.automaticSpeechRecognition({model, ...config as TaskInputMap[ModelToTaskMap[Models.FACEBOOK_WAV2VEC2_LARGE_960H_LV60_SELF]]});
    case Models.SUPERB_HUBERT_LARGE_SUPERB_ER:
        // Simulated method for audio classification
        return await hf.audioClassification({model, ...config as TaskInputMap[ModelToTaskMap[Models.SUPERB_HUBERT_LARGE_SUPERB_ER]]});
    case Models.ESPNET_KAN_BAYASHI_LJSPEECH_VITS:
        // Simulated method for text-to-speech
        return await hf.textToSpeech({model, ...config as TaskInputMap[ModelToTaskMap[Models.ESPNET_KAN_BAYASHI_LJSPEECH_VITS]]});
    case Models.GOOGLE_VIT_BASE_PATCH16_224:
        // Simulated method for image classification
        return await hf.imageClassification({model, ...config as TaskInputMap[ModelToTaskMap[Models.GOOGLE_VIT_BASE_PATCH16_224]]});
    case Models.FACEBOOK_DETR_RESNET_50:
        // Simulated method for object detection
        return await hf.objectDetection({model, ...config as TaskInputMap[ModelToTaskMap[Models.FACEBOOK_DETR_RESNET_50]]});
    case Models.FACEBOOK_DETR_RESNET_50_PANOPTIC:
        // Simulated method for image segmentation
        return await hf.imageSegmentation({model, ...config as TaskInputMap[ModelToTaskMap[Models.FACEBOOK_DETR_RESNET_50_PANOPTIC]]});
    case Models.STABILITYAI_STABLE_DIFFUSION_2:
        // Simulated method for text-to-image
        return await hf.textToImage({model, ...config as TaskInputMap[ModelToTaskMap[Models.STABILITYAI_STABLE_DIFFUSION_2]]});
    case Models.NLPCONNECT_VIT_GPT2_IMAGE_CAPTIONING:
        // Simulated method for image-to-text
        return await hf.imageToText({model, ...config as TaskInputMap[ModelToTaskMap[Models.NLPCONNECT_VIT_GPT2_IMAGE_CAPTIONING]]});
    case Models.DANDELIN_VILT_B32_FINETUNED_VQA:
        // Simulated method for visual question answering
        return await hf.visualQuestionAnswering({model, ...config as TaskInputMap[ModelToTaskMap[Models.DANDELIN_VILT_B32_FINETUNED_VQA]]});
    case Models.IMPIRA_LAYOUTLM_DOCUMENT_QA:
        // Simulated method for document question answering
        return await hf.documentQuestionAnswering({model, ...config as TaskInputMap[ModelToTaskMap[Models.IMPIRA_LAYOUTLM_DOCUMENT_QA]]});
    case Models.SCIKIT_LEARN_FISH_WEIGHT:
        // Simulated method for tabular regression
        return await hf.tabularRegression({model, ...config as TaskInputMap[ModelToTaskMap[Models.SCIKIT_LEARN_FISH_WEIGHT]]});
    case Models.VVMNNNKV_WINE_QUALITY:
        // Simulated method for tabular classification
        return await hf.tabularClassification({model, ...config as TaskInputMap[ModelToTaskMap[Models.VVMNNNKV_WINE_QUALITY]]});
   default:
      throw new Error("Model not supported or task not implemented.");
  }
}

