import * as React from 'react';
import { getString } from "../utils"
import { Assistant, System, User, getMessages } from "./messages"
import { renderToString } from 'react-dom/server';
import { ChatModelsEnum, ChatResponseFormatEnum, getChatCompletion } from '../openai/service';


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

export const ToolContext = React.createContext<{ tools: ITool[] }>({ tools: [] });

const ToolsProvider: React.FC<IBaseChat> = ({ children, tools }) => {
  return <ToolContext.Provider value={{ tools }}>{children}</ToolContext.Provider>;
};



const Chat = ({tools, children}: IBaseChat) => {
  const messages = React.Children.map(children, child => {
    const data = getString(<ToolsProvider
      tools={tools}
    >{child}
    </ToolsProvider>
    )
    return JSON.parse(data)
  })

  return <>
    {JSON.stringify(messages)}
  </>
}


export const ChatCompletion = ({tools, children}: IBaseChat) => {
  const messages = getString(
    <Chat tools={tools}>{children}</Chat>
  )
  const parsedMessages = JSON.parse(messages);
  return <>
    {JSON.stringify(parsedMessages)}
  </>
}



export const getChatCompletionRenderer = (chatCompletionCallback: (messages: any) => Promise<any>) => {

  return async (jsxChatCompletionComponent: React.ReactElement) => {
    const tools = jsxChatCompletionComponent.props.tools || [];
  
    let toolsToExecute: Record<ITool['command'], ITool['execute']> = {};
    tools.forEach((tool: ITool) => {
      if (tool.command in toolsToExecute) {
        throw new Error(`Duplicate command ${tool.command}`)
      }
      if (tool.trigger in toolsToExecute) {
        throw new Error(`Duplicate trigger ${tool.trigger}`)
      }
      if (tool.toolName in toolsToExecute) {
        throw new Error(`Duplicate toolName ${tool.toolName}`)
      }
      toolsToExecute[tool.command] = tool.execute
    });
  
    const messages = getString(jsxChatCompletionComponent);
  
    const parsedMessages = JSON.parse(messages);
  
    const completions = await chatCompletionCallback(parsedMessages);
    
    const message = completions.choices[0].message;
  
    try {
      if (message && message.content) {
        const parsedMessage = JSON.parse(message.content);
        if (parsedMessage.command in toolsToExecute) {
          const params = parsedMessage.params;
          return {
            runTool: async () => {
              const result = await toolsToExecute[parsedMessage.command](params);
              return {
                type: parsedMessage.command,
                result
              }
            },
            message
          }
        }
        return {
          runTool: async () => {
            return {
              type: 'DEFAULT',
              result: message.content
            }
          },
          message
        }
      }
    } catch (error) {
      return {
        runTool: async () => {
          return {
            type: 'DEFAULT',
            result: message.content
          }
        },
        message
      }
    }
    return {
      runTool: async () => {
        return {
          type: 'DEFAULT',
          result: message.content
        }
      },
      message
    }
  }

}


// const main = async () => {
//   const renderChatCompletion = getChatCompletionRenderer(async (messages) => {
//     return await getChatCompletion(process.env.OPENAI_KEY, messages, ChatModelsEnum.GPT_3P5_TURBO);
//   });

//   const {runTool, message} = await renderChatCompletion(
//     <ChatCompletion
//       tools={[
//         {
//           toolName: "Fetch Weather Data",
//           trigger: "for when you need to fetch real-time weather data",
//           command: "FETCH_WEATHER_DATA",
//           params: { city: "string" },
//           execute: async ({ city }) => {
//             try {
//               const response = await fetch(`https://api.weatherapi.com/v1/current.json?q=${city}`);
//               const data = await response.json();
//               return `Current weather in ${city}: ${data.current.temp_c}°C, ${data.current.condition.text}`;
//             } catch (error) {
//               return `Failed to fetch weather data for ${city}`;
//             }
//           }
//         }
//       ]}
//     >
//       <System>Hi</System>
//       <User name="Bobbert">
//         Hi my name is Bobbert and these are the tools you can use with me.

//         Help me out here, can you respond with ONLY a variation of the following JSON object?
//       </User>
//       <Assistant>
//         Thank you! I will use this tool.
//       </Assistant>
//       <User>
//         What's the weather in Brampton right now? 
//       </User>
//     </ChatCompletion>
//   );

//   console.log('content', message);
//   const toolResult = await runTool();
//   console.log('result', toolResult);
// }

// main()

