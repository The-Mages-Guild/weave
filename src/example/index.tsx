
import * as React from 'react';
import { Tool, ToolBox,  } from '../lib/core';
import { execute } from '../lib';
import { ChatModelsEnum, ChatResponseFormatEnum } from '../lib/openai/service';
import { OpenAI } from '../lib/openai';
import { Assistant, System, User } from '../lib/core';
import { Text } from '../lib/core/text';

const main = async () => {

  
  type WEATHER = {}
  type SPORTS = {}

  type ToolBox = WEATHER | SPORTS;

const [content, toolResult] = await execute<ToolBox>(
    <OpenAI.ChatCompletions
      model={ChatModelsEnum.GPT_3P5_TURBO_0125}
      responseFormat={ChatResponseFormatEnum.JSON}
      apiKey={process.env.OPENAI_KEY}
    >
      <OpenAI.Messages>
        <System>
          <ToolBox>
            <Tool
              toolName="Fetch Weather Data"
              trigger="for when you need to fetch real-time weather data"
              command="FETCH_WEATHER_DATA"
              params={{ city: "string" }}
              execute={async ({ city }) => {
                try {
                  const response = await fetch(`https://api.weatherapi.com/v1/current.json?q=${city}`);
                  const data = await response.json();
                  return `Current weather in ${city}: ${data.current.temp_c}°C, ${data.current.condition.text}`;
                } catch (error) {
                  return `Failed to fetch weather data for ${city}`;
                }
              }}
            />
          </ToolBox>
        </System>
        <User name="Bobbert">
          <Text>
            Hi my name is Bobbert and these are the tools you can use with me.

            Help me out here, can you respond with ONLY a variation of the following JSON object?
          </Text>
          <ToolBox>
            <Tool
              toolName="Check The Sports"
              trigger="when you need to check the sports points"
              command="CHECK_SPORTS"
              params={{
                sportsLeague: "string",
                teams: "string[]"
              }}
              execute={({sportsLeague, teams}) => {
                return `Checking the sports in ${sportsLeague} for ${teams}`;
              }}
            />
          </ToolBox>
        </User>
        <Assistant>
          Thank you! I will use this tool.
        </Assistant>
        <User>
          <Text>
            What's the weather in Brampton right now? 
          </Text>
        </User>
      </OpenAI.Messages>
    </OpenAI.ChatCompletions>
  );

  console.log('content', content);
  console.log('result', toolResult.data);

}

main();