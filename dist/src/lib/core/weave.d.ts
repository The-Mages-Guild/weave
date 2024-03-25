import { Models, ResolveTaskInput } from './types/models.enum';
type Params = {
    model: Models;
    config: ResolveTaskInput<Models>;
};
interface IWeaveCore {
    params: Params;
    execute: (config: ResolveTaskInput<Models>) => any;
}
export declare const CoreModelConfig: ({ params, execute }: IWeaveCore) => import("react/jsx-runtime").JSX.Element;
export declare const Summarization: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const FillMask: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const QuestionAnswering: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const TableQuestionAnswering: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const TextClassification: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const TextGeneration: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const TextGenerationStream: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const TokenClassification: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const Translation: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const ZeroShotClassification: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const Conversational: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const SentenceSimilarity: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const FeatureExtraction: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const AutomaticSpeechRecognition: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const AudioClassification: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const TextToSpeech: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const ImageClassification: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const ObjectDetection: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const ImageSegmentation: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const TextToImage: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const ImageToText: ({ config }: {
    config: Params['config'];
}) => import("react/jsx-runtime").JSX.Element;
export declare const ExampleUsage: () => import("react/jsx-runtime").JSX.Element;
export {};
