
import * as React from 'react';
import { executeHuggingfaceModel } from '../huggingface';
import { Models, ResolveTaskInput } from './types/models.enum';
import { Metadata } from './metadata';
import { renderAst } from "react-ast";
import { renderToStaticMarkup, renderToString } from 'react-dom/server';

import { render, JSXXML, Raw } from 'jsx-xml'

type Params = {
  model: Models;
  // Input should depend on the Model given in params above
  config: ResolveTaskInput<Models>;
};
interface IWeaveCore {
  params: Params;
  execute: (config: ResolveTaskInput<Models>) => any;
}

export const CoreModelConfig = ({
  params,
  execute
}: IWeaveCore) => {
  return (
    <>
      <Metadata
        key={params.model}
        model={params.model}
        config={params.config}
        execute={execute} 
      />
    </>
  );
}

const createModelComponent = (defaultModel: Models) => {
  return ({ config }: {config: Params['config']}) => {
    const execute = async (configuration: Params['config']) => {
      return await executeHuggingfaceModel(defaultModel, configuration);
    }

    return (
      <CoreModelConfig
        params={{
          model: defaultModel,
          config
        }}
        execute={execute}
      />
    );
  };
};

export const Summarization = createModelComponent(Models.FACEBOOK_BART_LARGE_CNN);
export const FillMask = createModelComponent(Models.BERT_BASE_UNCASED);
export const QuestionAnswering = createModelComponent(Models.DEEPSET_ROBERTA_BASE_SQUAD2);
export const TableQuestionAnswering = createModelComponent(Models.GOOGLE_TAPAS_BASE_FINETUNED_WTQ);
export const TextClassification = createModelComponent(Models.DISTILBERT_BASE_UNCASED_FINETUNED_SST_2_ENGLISH);
export const TextGeneration = createModelComponent(Models.GPT2);
export const TextGenerationStream = createModelComponent(Models.GOOGLE_FLAN_T5_XXL);
export const TokenClassification = createModelComponent(Models.DBMDZ_BERT_LARGE_CASED_FINETUNED_CONLL03_ENGLISH);
export const Translation = createModelComponent(Models.T5_BASE);
export const ZeroShotClassification = createModelComponent(Models.FACEBOOK_BART_LARGE_MNLI);
export const Conversational = createModelComponent(Models.MICROSOFT_DIALOGPT_LARGE);
export const SentenceSimilarity = createModelComponent(Models.SENTENCE_TRANSFORMERS_PARAPHRASE_XLM_R_MULTILINGUAL_V1);
export const FeatureExtraction = createModelComponent(Models.SENTENCE_TRANSFORMERS_DISTILBERT_BASE_NLI_MEAN_TOKENS);
export const AutomaticSpeechRecognition = createModelComponent(Models.FACEBOOK_WAV2VEC2_LARGE_960H_LV60_SELF);
export const AudioClassification = createModelComponent(Models.SUPERB_HUBERT_LARGE_SUPERB_ER);
export const TextToSpeech = createModelComponent(Models.ESPNET_KAN_BAYASHI_LJSPEECH_VITS);
export const ImageClassification = createModelComponent(Models.GOOGLE_VIT_BASE_PATCH16_224);
export const ObjectDetection = createModelComponent(Models.FACEBOOK_DETR_RESNET_50);
export const ImageSegmentation = createModelComponent(Models.FACEBOOK_DETR_RESNET_50_PANOPTIC);
export const TextToImage = createModelComponent(Models.STABILITYAI_STABLE_DIFFUSION_2);
export const ImageToText = createModelComponent(Models.NLPCONNECT_VIT_GPT2_IMAGE_CAPTIONING);



export const ExampleUsage = () => {

  return (
    <>
      <FillMask
        config={{
          inputs: 'The quick brown [MASK] jumps over the lazy dog',
        }}
      />
    </>
  );
}

// // This helper function will be used to add metadata to its correct path
// const addToPath = (paths, path, metadata) => {
//   const foundPath = paths.find(p => p.path === path);
//   if (foundPath) {
//     foundPath.metadata.push(metadata);
//   } else {
//     paths.push({ path, metadata: [metadata] });
//   }
// }

// Improved recursive function to traverse the tree and collect metadata paths
// export function findAllMetadata(element, currentPath = 'Root', collectedMetadata = []) {
//   if (!React.isValidElement(element)) return collectedMetadata;

//   // Debugging: Log the current path and element type
//   console.log(`Visiting: ${currentPath}, Type: ${element.type.name || element.type}`);

//   // Check if the element is a Metadata component
//   if (element.type === Metadata) {
//     // If it is, add its props (or a specific prop, like 'data') to the collected metadata
//     collectedMetadata.push(element.props); // Adjust based on what you want to collect
//   }

//   // If the element has children, continue the traversal
//   if (element.props && element.props.children) {
//     React.Children.forEach(element.props.children, (child, index) => {
//       // Construct a new path for the child element
//       const childPath = `${currentPath} > ${child.type.name || child.type || 'Anonymous'}:${index}`;
//       // Recursively find metadata in the child elements
//       findAllMetadata(child, childPath, collectedMetadata);
//     });
//   }

//   return collectedMetadata;
// }

// const evoke = async (jsxComponent: React.ReactElement) => {

//   const metadata = findAllMetadata(jsxComponent);
//   // findA
//   console.log('metadata', metadata);

// }

// const XMLElement = (props) => {
//   // const attrs = Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ');
//   return React.createElement('Metadata', props, null);
// };

// // Define specific XML tags as needed
// const Book = ({ children, ...props }) => <XMLElement  {...props}>{children}</XMLElement>;
// const Title = ({ children }) => <XMLElement>{children}</XMLElement>;
// const Author = ({ children }) => <XMLElement>{children}</XMLElement>;


// const main = async () => {

//   const xmlString =  renderToStaticMarkup(<ExampleUsage />);
//   console.log(xmlString); // This will log the XML string

//   await evoke(
//     <ExampleUsage />
//   );
// }

// main();