declare module "src/example/index" { }
declare module "src/lib/execute" { }
declare module "src/lib/utils/index" {
    export const getString: (component: React.ReactNode) => string;
}
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
declare module "src/lib/core/metadata" {
    import * as React from 'react';
    export interface IMetadata {
        [key: string]: any;
        key: string;
    }
    export const Metadata: (props: IMetadata) => React.ReactElement<IMetadata, string | React.JSXElementConstructor<any>>;
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
declare module "src/lib/core/chat-completion" {
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
    export const ToolContext: React.Context<{
        tools: ITool[];
    }>;
    export const ChatCompletion: ({ tools, children }: IBaseChat) => import("react/jsx-runtime").JSX.Element;
    export const getChatCompletionRenderer: (chatCompletionCallback: (messages: any) => Promise<any>) => (jsxChatCompletionComponent: React.ReactElement) => Promise<{
        runTool: () => Promise<{
            type: any;
            result: any;
        }>;
        message: any;
    } | undefined>;
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
declare module "src/lib/core/index" {
    export { Text } from "src/lib/core/text";
    export { Markdown } from "src/lib/core/markdown";
    export { System, User, Assistant, getMessageRole, getMessages } from "src/lib/core/messages/index";
    export { ToolBox, Tool, findAllToolBoxes, getToolBox } from "src/lib/core/toolbox/index";
    export { ChatCompletion, getChatCompletionRenderer } from "src/lib/core/chat-completion";
}
declare module "src/lib/index" {
    export { getString } from "src/lib/utils/index";
    export { Text, Markdown, System, User, Assistant, getChatCompletionRenderer, ChatCompletion } from "src/lib/core/index";
    export { ChatModelsEnum, ChatResponseFormatEnum, ChatModels, ChatResponseFormat, getChatCompletion } from "src/lib/openai/service/index";
}
declare module "src/lib/core/dumb-character-count" {
    interface IDumbCharacterCount {
        limit?: number;
        children: string;
    }
    export const DumbCharacterCount: ({ limit, children }: IDumbCharacterCount) => string | import("react/jsx-runtime").JSX.Element | null;
}
declare module "src/lib/core/types/models.enum" {
    export enum Models {
        BERT_BASE_UNCASED = "bert-base-uncased",
        FACEBOOK_BART_LARGE_CNN = "facebook/bart-large-cnn",
        DEEPSET_ROBERTA_BASE_SQUAD2 = "deepset/roberta-base-squad2",
        GOOGLE_TAPAS_BASE_FINETUNED_WTQ = "google/tapas-base-finetuned-wtq",
        DISTILBERT_BASE_UNCASED_FINETUNED_SST_2_ENGLISH = "distilbert-base-uncased-finetuned-sst-2-english",
        GPT2 = "gpt2",
        GOOGLE_FLAN_T5_XXL = "google/flan-t5-xxl",
        DBMDZ_BERT_LARGE_CASED_FINETUNED_CONLL03_ENGLISH = "dbmdz/bert-large-cased-finetuned-conll03-english",
        T5_BASE = "t5-base",
        FACEBOOK_BART_LARGE_MNLI = "facebook/bart-large-mnli",
        MICROSOFT_DIALOGPT_LARGE = "microsoft/DialoGPT-large",
        SENTENCE_TRANSFORMERS_PARAPHRASE_XLM_R_MULTILINGUAL_V1 = "sentence-transformers/paraphrase-xlm-r-multilingual-v1",
        SENTENCE_TRANSFORMERS_DISTILBERT_BASE_NLI_MEAN_TOKENS = "sentence-transformers/distilbert-base-nli-mean-tokens",
        FACEBOOK_WAV2VEC2_LARGE_960H_LV60_SELF = "facebook/wav2vec2-large-960h-lv60-self",
        SUPERB_HUBERT_LARGE_SUPERB_ER = "superb/hubert-large-superb-er",
        ESPNET_KAN_BAYASHI_LJSPEECH_VITS = "espnet/kan-bayashi_ljspeech_vits",
        SPEECHBRAIN_SEPFORMER_WHAM = "speechbrain/sepformer-wham",
        GOOGLE_VIT_BASE_PATCH16_224 = "google/vit-base-patch16-224",
        FACEBOOK_DETR_RESNET_50 = "facebook/detr-resnet-50",
        FACEBOOK_DETR_RESNET_50_PANOPTIC = "facebook/detr-resnet-50-panoptic",
        STABILITYAI_STABLE_DIFFUSION_2 = "stabilityai/stable-diffusion-2",
        NLPCONNECT_VIT_GPT2_IMAGE_CAPTIONING = "nlpconnect/vit-gpt2-image-captioning",
        LLLYASVIEL_SD_CONTROLNET_DEPTH = "lllyasviel/sd-controlnet-depth",
        OPENAI_CLIP_VIT_LARGE_PATCH14_336 = "openai/clip-vit-large-patch14-336",
        DANDELIN_VILT_B32_FINETUNED_VQA = "dandelin/vilt-b32-finetuned-vqa",
        IMPIRA_LAYOUTLM_DOCUMENT_QA = "impira/layoutlm-document-qa",
        SCIKIT_LEARN_FISH_WEIGHT = "scikit-learn/Fish-Weight",
        VVMNNNKV_WINE_QUALITY = "vvmnnnkv/wine-quality",
        MY_CUSTOM_MODEL = "my-custom-model"
    }
    export enum Tasks {
        FILL_MASK = "fillMask",
        SUMMARIZATION = "summarization",
        QUESTION_ANSWERING = "questionAnswering",
        TABLE_QUESTION_ANSWERING = "tableQuestionAnswering",
        TEXT_CLASSIFICATION = "textClassification",
        TEXT_GENERATION = "textGeneration",
        TOKEN_CLASSIFICATION = "tokenClassification",
        TRANSLATION = "translation",
        ZERO_SHOT_CLASSIFICATION = "zeroShotClassification",
        CONVERSATIONAL = "conversational",
        SENTENCE_SIMILARITY = "sentenceSimilarity",
        FEATURE_EXTRACTION = "featureExtraction",
        AUTOMATIC_SPEECH_RECOGNITION = "automaticSpeechRecognition",
        AUDIO_CLASSIFICATION = "audioClassification",
        TEXT_TO_SPEECH = "textToSpeech",
        AUDIO_TO_AUDIO = "audioToAudio",
        IMAGE_CLASSIFICATION = "imageClassification",
        OBJECT_DETECTION = "objectDetection",
        IMAGE_SEGMENTATION = "imageSegmentation",
        TEXT_TO_IMAGE = "textToImage",
        IMAGE_TO_TEXT = "imageToText",
        IMAGE_TO_IMAGE = "imageToImage",
        ZERO_SHOT_IMAGE_CLASSIFICATION = "zeroShotImageClassification",
        VISUAL_QUESTION_ANSWERING = "visualQuestionAnswering",
        DOCUMENT_QUESTION_ANSWERING = "documentQuestionAnswering",
        TABULAR_REGRESSION = "tabularRegression",
        TABULAR_CLASSIFICATION = "tabularClassification",
        CUSTOM_TASK = "customTask"
    }
    type FillMaskInputs = {
        inputs: string;
    };
    type SummarizationInputs = {
        inputs: string;
        parameters?: {
            max_length?: number;
        };
    };
    type QuestionAnsweringInputs = {
        inputs: {
            question: string;
            context: string;
        };
    };
    type TableQuestionAnsweringInputs = {
        inputs: {
            query: string;
            table: {
                [key: string]: string[];
            };
        };
    };
    type TextClassificationInputs = {
        inputs: string;
    };
    type TextGenerationInputs = {
        inputs: string;
        parameters?: {
            max_new_tokens?: number;
        };
    };
    type TokenClassificationInputs = {
        inputs: string;
    };
    type TranslationInputs = {
        inputs: string;
    };
    type ZeroShotClassificationInputs = {
        inputs: string;
        parameters: {
            candidate_labels: string[];
        };
    };
    type ConversationalInputs = {
        inputs: {
            past_user_inputs: string[];
            generated_responses: string[];
            text: string;
        };
    };
    type SentenceSimilarityInputs = {
        inputs: {
            source_sentence: string;
            sentences: string[];
        };
    };
    type FeatureExtractionInputs = {
        inputs: string;
    };
    type AutomaticSpeechRecognitionInputs = {
        data: Blob | ArrayBuffer;
    };
    type AudioClassificationInputs = {
        data: Blob | ArrayBuffer;
    };
    type TextToSpeechInputs = {
        inputs: string;
    };
    type AudioToAudioInputs = {
        data: Blob | ArrayBuffer;
    };
    type ImageClassificationInputs = {
        data: Blob | ArrayBuffer;
    };
    type ObjectDetectionInputs = {
        data: Blob | ArrayBuffer;
    };
    type ImageSegmentationInputs = {
        data: Blob | ArrayBuffer;
    };
    type TextToImageInputs = {
        inputs: string;
        parameters?: {
            negative_prompt?: string;
        };
    };
    type ImageToTextInputs = {
        data: Blob | ArrayBuffer;
    };
    type ImageToImageInputs = {
        inputs: any;
        parameters?: {
            prompt?: string;
        };
    };
    type ZeroShotImageClassificationInputs = {
        inputs: {
            image: any;
        };
        parameters: {
            candidate_labels: string[];
        };
    };
    type VisualQuestionAnsweringInputs = {
        inputs: {
            question: string;
            image: any;
        };
    };
    type DocumentQuestionAnsweringInputs = {
        inputs: {
            question: string;
            image: any;
        };
    };
    type TabularRegressionInputs = {
        inputs: {
            data: {
                [key: string]: string[];
            };
        };
    };
    type TabularClassificationInputs = {
        inputs: {
            data: {
                [key: string]: string[];
            };
        };
    };
    export type ModelToTaskMap = {
        [Models.BERT_BASE_UNCASED]: Tasks.FILL_MASK;
        [Models.FACEBOOK_BART_LARGE_CNN]: Tasks.SUMMARIZATION;
        [Models.DEEPSET_ROBERTA_BASE_SQUAD2]: Tasks.QUESTION_ANSWERING;
        [Models.GOOGLE_TAPAS_BASE_FINETUNED_WTQ]: Tasks.TABLE_QUESTION_ANSWERING;
        [Models.DISTILBERT_BASE_UNCASED_FINETUNED_SST_2_ENGLISH]: Tasks.TEXT_CLASSIFICATION;
        [Models.GPT2]: Tasks.TEXT_GENERATION;
        [Models.GOOGLE_FLAN_T5_XXL]: Tasks.TEXT_GENERATION;
        [Models.DBMDZ_BERT_LARGE_CASED_FINETUNED_CONLL03_ENGLISH]: Tasks.TOKEN_CLASSIFICATION;
        [Models.T5_BASE]: Tasks.TRANSLATION;
        [Models.FACEBOOK_BART_LARGE_MNLI]: Tasks.ZERO_SHOT_CLASSIFICATION;
        [Models.MICROSOFT_DIALOGPT_LARGE]: Tasks.CONVERSATIONAL;
        [Models.SENTENCE_TRANSFORMERS_PARAPHRASE_XLM_R_MULTILINGUAL_V1]: Tasks.SENTENCE_SIMILARITY;
        [Models.SENTENCE_TRANSFORMERS_DISTILBERT_BASE_NLI_MEAN_TOKENS]: Tasks.FEATURE_EXTRACTION;
        [Models.FACEBOOK_WAV2VEC2_LARGE_960H_LV60_SELF]: Tasks.AUTOMATIC_SPEECH_RECOGNITION;
        [Models.SUPERB_HUBERT_LARGE_SUPERB_ER]: Tasks.AUDIO_CLASSIFICATION;
        [Models.ESPNET_KAN_BAYASHI_LJSPEECH_VITS]: Tasks.TEXT_TO_SPEECH;
        [Models.SPEECHBRAIN_SEPFORMER_WHAM]: Tasks.AUDIO_TO_AUDIO;
        [Models.GOOGLE_VIT_BASE_PATCH16_224]: Tasks.IMAGE_CLASSIFICATION;
        [Models.FACEBOOK_DETR_RESNET_50]: Tasks.OBJECT_DETECTION;
        [Models.FACEBOOK_DETR_RESNET_50_PANOPTIC]: Tasks.IMAGE_SEGMENTATION;
        [Models.STABILITYAI_STABLE_DIFFUSION_2]: Tasks.TEXT_TO_IMAGE;
        [Models.NLPCONNECT_VIT_GPT2_IMAGE_CAPTIONING]: Tasks.IMAGE_TO_TEXT;
        [Models.LLLYASVIEL_SD_CONTROLNET_DEPTH]: Tasks.IMAGE_TO_IMAGE;
        [Models.OPENAI_CLIP_VIT_LARGE_PATCH14_336]: Tasks.ZERO_SHOT_IMAGE_CLASSIFICATION;
        [Models.DANDELIN_VILT_B32_FINETUNED_VQA]: Tasks.VISUAL_QUESTION_ANSWERING;
        [Models.IMPIRA_LAYOUTLM_DOCUMENT_QA]: Tasks.DOCUMENT_QUESTION_ANSWERING;
        [Models.SCIKIT_LEARN_FISH_WEIGHT]: Tasks.TABULAR_REGRESSION;
        [Models.VVMNNNKV_WINE_QUALITY]: Tasks.TABULAR_CLASSIFICATION;
    };
    export type TaskInputMap = {
        [Tasks.FILL_MASK]: FillMaskInputs;
        [Tasks.SUMMARIZATION]: SummarizationInputs;
        [Tasks.QUESTION_ANSWERING]: QuestionAnsweringInputs;
        [Tasks.TABLE_QUESTION_ANSWERING]: TableQuestionAnsweringInputs;
        [Tasks.TEXT_CLASSIFICATION]: TextClassificationInputs;
        [Tasks.TEXT_GENERATION]: TextGenerationInputs;
        [Tasks.TOKEN_CLASSIFICATION]: TokenClassificationInputs;
        [Tasks.TRANSLATION]: TranslationInputs;
        [Tasks.ZERO_SHOT_CLASSIFICATION]: ZeroShotClassificationInputs;
        [Tasks.CONVERSATIONAL]: ConversationalInputs;
        [Tasks.SENTENCE_SIMILARITY]: SentenceSimilarityInputs;
        [Tasks.FEATURE_EXTRACTION]: FeatureExtractionInputs;
        [Tasks.AUTOMATIC_SPEECH_RECOGNITION]: AutomaticSpeechRecognitionInputs;
        [Tasks.AUDIO_CLASSIFICATION]: AudioClassificationInputs;
        [Tasks.TEXT_TO_SPEECH]: TextToSpeechInputs;
        [Tasks.AUDIO_TO_AUDIO]: AudioToAudioInputs;
        [Tasks.IMAGE_CLASSIFICATION]: ImageClassificationInputs;
        [Tasks.OBJECT_DETECTION]: ObjectDetectionInputs;
        [Tasks.IMAGE_SEGMENTATION]: ImageSegmentationInputs;
        [Tasks.TEXT_TO_IMAGE]: TextToImageInputs;
        [Tasks.IMAGE_TO_TEXT]: ImageToTextInputs;
        [Tasks.IMAGE_TO_IMAGE]: ImageToImageInputs;
        [Tasks.ZERO_SHOT_IMAGE_CLASSIFICATION]: ZeroShotImageClassificationInputs;
        [Tasks.VISUAL_QUESTION_ANSWERING]: VisualQuestionAnsweringInputs;
        [Tasks.DOCUMENT_QUESTION_ANSWERING]: DocumentQuestionAnsweringInputs;
        [Tasks.TABULAR_REGRESSION]: TabularRegressionInputs;
        [Tasks.TABULAR_CLASSIFICATION]: TabularClassificationInputs;
    };
    export type ResolveTaskInput<M extends Models> = M extends keyof ModelToTaskMap ? TaskInputMap[ModelToTaskMap[M]] : never;
}
declare module "src/lib/huggingface/index" {
    import { Models, ResolveTaskInput } from "src/lib/core/types/models.enum";
    export function executeHuggingfaceModel<M extends Models>(model: M, config: ResolveTaskInput<M>): Promise<Blob | import("@huggingface/inference").FillMaskOutput | import("@huggingface/inference").SummarizationOutput | import("@huggingface/inference").TableQuestionAnsweringOutput | import("@huggingface/inference").TextClassificationOutput | import("@huggingface/inference").TextGenerationOutput | AsyncGenerator<import("@huggingface/inference").TextGenerationStreamOutput, any, unknown> | import("@huggingface/inference").TokenClassificationOutput | import("@huggingface/inference").TranslationOutput | import("@huggingface/inference").ZeroShotClassificationOutput | import("@huggingface/inference").FeatureExtractionOutput | import("@huggingface/inference").AutomaticSpeechRecognitionOutput | import("@huggingface/inference").VisualQuestionAnsweringOutput | import("@huggingface/inference").DocumentQuestionAnsweringOutput>;
}
declare module "src/lib/core/weave" {
    import { Models, ResolveTaskInput } from "src/lib/core/types/models.enum";
    type Params = {
        model: Models;
        config: ResolveTaskInput<Models>;
    };
    interface IWeaveCore {
        params: Params;
        execute: (config: ResolveTaskInput<Models>) => any;
    }
    export const CoreModelConfig: ({ params, execute }: IWeaveCore) => import("react/jsx-runtime").JSX.Element;
    export const Summarization: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const FillMask: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const QuestionAnswering: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const TableQuestionAnswering: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const TextClassification: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const TextGeneration: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const TextGenerationStream: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const TokenClassification: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const Translation: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const ZeroShotClassification: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const Conversational: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const SentenceSimilarity: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const FeatureExtraction: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const AutomaticSpeechRecognition: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const AudioClassification: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const TextToSpeech: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const ImageClassification: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const ObjectDetection: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const ImageSegmentation: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const TextToImage: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const ImageToText: ({ config }: {
        config: Params['config'];
    }) => import("react/jsx-runtime").JSX.Element;
    export const ExampleUsage: () => import("react/jsx-runtime").JSX.Element;
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
