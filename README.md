# Table of Contents

- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
- [Components](#components)
  - [OpenAI.ChatCompletions](#openaichatcompletions)
    - [Props](#props)
    - [Usage Example](#usage-example)
  - [OpenAI.Messages](#openaimessages)
    - [Usage](#usage)
    - [Example](#example)
    - [Key Points](#key-points)
  - [System, User, Assistant](#system-user-assistant)
    - [System](#system)
      - [Usage Example](#usage-example-1)
    - [User](#user)
      - [Usage Example](#usage-example-2)
    - [Assistant](#assistant)
      - [Usage Example](#usage-example-3)
    - [Key Features](#key-features)
  - [Text](#text)
    - [Features](#features)
    - [Usage Example](#usage-example-4)
  - [ToolBox and Tool](#toolbox-and-tool)
    - [ToolBox](#toolbox)
      - [Usage Example](#usage-example-5)
    - [Tool](#tool)
      - [Properties](#properties)
      - [Usage Example](#usage-example-6)
    - [Key Features](#key-features-1)
  - [Utility Functions](#utility-functions)
    - [getString](#getstring)
      - [Usage](#usage-1)
    - [execute](#execute)
      - [Usage](#usage-2)
    - [findAllToolBoxes](#findalltoolboxes)
      - [Usage](#usage-3)
    - [getToolBox](#gettoolbox)
      - [Usage](#usage-4)
  - [API Reference](#api-reference)
    - [Interfaces](#interfaces)
      - [IToolBox](#itoolbox)
      - [ITool](#itool)
      - [IMessage](#imessage)
    - [Enums](#enums)
      - [ChatModelsEnum](#chatmodelsenum)


# Introduction

Welcome to `weave`, a practical TypeScript-JSX library crafted with the intent to simplify the interaction between your server-side logic and Language Learning Models (LLMs). At its core, `weave` uses the familiar JSX syntax to abstract away the complexities of crafting natural language prompts and orchestrating LLM operations.

In the day-to-day development journey, we often encounter repetitive tasks, especially when dealing with conversational AI and other language processing utilities. `weave` was born from the idea that there should be an easier, more maintainable way to handle these repetitive elements — a way that feels second nature to those of us who've grown fond of React's component-based approach.

The goal with `weave` is to encapsulate the verbose bits, allowing us to focus on creating applications with AI & Natural Language.

# Getting Started

Diving into `weave` is straightforward and familiar if you've worked with Node.js projects before. Here's how to get your setup ready and take your first steps with the library.

## Installation

Still gotta put up on NPM :)

## Basic Usage

Here's a quick look at how to use `weave` to construct a simple chat completion prompt with an associated tool:

```tsx
import * as React from 'react';
import { execute } from '@mages-guild/weave';
import { ChatModelsEnum, ChatResponseFormatEnum } from '@mages-guild/weave/lib/openai/service';
import { OpenAI } from '@mages-guild/weave/lib/openai';
import { System, User, Assistant } from '@mages-guild/weave/lib/core';
import { Text, Tool, ToolBox } from '@mages-guild/weave/lib/core';

// Define the expected data type for the tool result
type WeatherDataType = {
  temperature: string;
  condition: string;
};

// Execute the chat completion component
const main = async () => {
  const [content, toolResult] = await execute<WeatherDataType>(
    <OpenAI.ChatCompletions
      model={ChatModelsEnum.GPT_3P5_TURBO_0125}
      responseFormat={ChatResponseFormatEnum.JSON}
      apiKey={process.env.OPENAI_KEY}
    >
      <OpenAI.Messages>
        <System name="System">
          <Text>
            You are an LLM that is tasked with fetching Weather Data on behalf of the user
          </Text>
          <ToolBox>
            <Tool
              toolName="Fetch Weather Data"
              trigger="fetch weather"
              command="FETCH_WEATHER_DATA"
              params={{ city: "is a string" }}
              execute={async ({ city }) => {
                // Here you would call an external weather API and return the data
                const weather = await getWeather(city);
                return {
                  temperature: weather.temperature,
                  condition: weather.condition,
                };
              }}
            />
          </ToolBox>
        </System>
        <User name="Gale">
          <Text>What's the weather like in Toronto today?</Text>
        </User>
      </OpenAI.Messages>
    </OpenAI.ChatCompletions>
  );

  console.log('Content:', content);
  const { temperature, condition } = toolResult.data; // type is WeatherDataType
  console.log('Temperature:', temperature);
  console.log('Condition:', condition);
};

// Call the main function to run the example
main();
```

In the above example, `weave` uses React components to set up a chat completion flow where a user asks about the weather, and a `Tool` component is defined to handle the fetching of weather data.

`execute` handles the rendering & processing of the JSX under the hood.


# Components

`weave` provides a suite of React components designed to encapsulate various aspects of building and managing chat interactions with Language Learning Models (LLMs). These components allow developers to structure their interactions with LLMs in a declarative and organized manner, similar to building a UI with React, but for server-side logic instead.

## OpenAI.ChatCompletions

The `OpenAI.ChatCompletions` component is the entry point for defining a conversation with an LLM. It sets the context for the chat completion task, specifying the model to use and how the responses should be formatted. This component wraps all message exchanges and tool uses within the chat, orchestrating the flow of the conversation.

### Props

- **model**: Specifies the model of the LLM to be used for generating responses. The model is selected from predefined enums, such as `GPT_3P5_TURBO`, to ensure compatibility and ease of use.
- **responseFormat**: Defines the format of the model's response. Options include returning responses in JSON or plain text, accommodating different processing needs.
- **apiKey**: Your API key for accessing the OpenAI API. This is essential for authenticating and making requests to the service.

### Usage Example

Below is an example of how to use the `OpenAI.ChatCompletions` component to set up a simple chat completion scenario:

```tsx
import * as React from 'react';
import { ChatModelsEnum, ChatResponseFormatEnum } from '@mages-guild/weave/lib/openai/service';
import { OpenAI, System, User } from '@mages-guild/weave';

const ChatCompletionExample = () => {
  return (
    <OpenAI.ChatCompletions model={ChatModelsEnum.GPT_3P5_TURBO_0125} responseFormat={ChatResponseFormatEnum.JSON} apiKey="your-api-key-here">
      <OpenAI.Messages>
        <System>
          You are the Forgotten Realms' Lorekeeper. Your job is to provide knowledge pertaining to
          the forgotten realms in the form of an Encyclopedia entry written with the bias of a Lawful Evil 
          devil from the 9-hells who is angry about the course of history on the Material Plane and other realms.
        </System>
        <User name="Tav">
          I'm looking for information about Candlekeep
        </User>
        {/* Additional messages and tools can be nested here */}
      </OpenAI.Messages>
    </OpenAI.ChatCompletions>
  );
};
```

In this example, the `OpenAI.ChatCompletions` component wraps a conversation starting with a system message and a user query. This structure allows you to define the flow of the chat, leveraging the power of LLMs to generate responses, execute commands, or fetch data based on the conversation's context.


## OpenAI.Messages

The `OpenAI.Messages` component acts as a container for organizing the messages exchanged between the system, the user, and the assistant within a chat. It structures the conversation's flow, ensuring that each message is processed and responded to in the context of the ongoing interaction. This component is essential for defining the sequence of messages that will be sent to the LLM for processing.

### Usage

Within the `OpenAI.ChatCompletions` component, `OpenAI.Messages` collects and organizes the dialogue components, such as `System`, `User`, and `Assistant` messages. This hierarchical organization allows the library to process the conversation logically and sequentially, mirroring the natural flow of a chat.

### Example

Here's a simple example illustrating how `OpenAI.Messages` is used within the context of a chat completion task:

```tsx
import * as React from 'react';
import { OpenAI, System, User, Assistant } from '@mages-guild/weave';

const ChatMessagesExample = () => {
  return (
    <OpenAI.ChatCompletions model="your-model" responseFormat="your-response-format" apiKey="your-api-key">
      <OpenAI.Messages>
        <System>
          Welcome! I'm here to help. What can I do for you today?
        </System>
        <User name="Alex">
          Can you tell me the weather forecast for today?
        </User>
        <Assistant>
          Sure, let me check that for you.
        </Assistant>
        {/* The conversation can continue with more messages or tools */}
      </OpenAI.Messages>
    </OpenAI.ChatCompletions>
  );
};
```

In this example, `OpenAI.Messages` wraps a sequence of messages that represent a conversation's opening. A `System` message greets the user, followed by a `User` message asking a question, and an `Assistant` message indicating that the request is being processed. This structured approach allows developers to design conversations intuitively, focusing on the dialogue's content rather than the underlying implementation details.

### Key Points

- **Sequential Logic**: `OpenAI.Messages` ensures that the messages are processed in the order they are defined, maintaining the conversation's logical flow.
- **Flexibility**: You can include various types of messages, such as questions from users, responses from the assistant, or informational messages from the system.
- **Context Management**: By encapsulating messages within this component, `weave` maintains the context of the conversation, allowing the LLM to generate relevant and coherent responses.


## System, User, Assistant

Within the `weave` library, the components `System`, `User`, and `Assistant` serve as the building blocks for constructing the dialogue within a chat completion task. These components represent different roles in the conversation, allowing for a structured and clear communication flow between the system, the user, and the AI assistant.

### System

The `System` component is used to give the LLM an identity. 

#### Usage Example

```tsx
<System>
  You are a pirate. You will only speak like a pirate in the piratiest pirate accent.
</System>
```

### User

The `User` component represents messages from the user to the system or assistant. This component is crucial for capturing the user's input and queries, which are then processed by the LLM or used to trigger specific tools or commands.

#### Usage Example

```tsx
<User name="Teach">
  What's the weather like in New York today?
</User>
```

### Assistant

The `Assistant` component is used for messages generated by the AI assistant in response to the user's queries or as part of the conversation flow. These messages are typically the result of processing the user's input through the LLM and generating a response.

#### Usage Example

```tsx
<Assistant>
  Currently, it's sunny in New York with a high of 75 degrees.
</Assistant>
```

### Key Features

- **Clarity and Organization**: By distinguishing between the system, user, and assistant messages, `weave` allows for a clear and organized conversation flow. This structure makes it easier to design and understand the dialogue within the chat.
- **Flexibility**: These components can be used in various combinations to create complex conversational scenarios. They support the inclusion of additional components, such as `ToolBox` and `Tool`, to enhance the chat's functionality.
- **Contextual Awareness**: By structuring conversations with these components, `weave` maintains the context of the dialogue, enabling the LLM to provide coherent and relevant responses based on the roles of the participants in the conversation.

## Text

The `Text` component in `weave` serves as a versatile wrapper for textual content within the conversational components like `System`, `User`, and `Assistant`. It provides a simple yet effective way to include formatted text, ensuring that your messages are clearly presented within the chat flow.

### Features

- **Simplicity**: Designed for ease of use, `Text` allows you to encapsulate text messages without worrying about additional formatting or processing.
- **Flexibility**: It accepts strings, JSX elements, or arrays thereof, making it adaptable to various content types you may need to display within your chat interactions.
- **Compatibility**: Seamlessly integrates with other `weave` components, maintaining the structured and logical flow of conversation.

### Usage Example

```tsx
<User name="Charlie">
  <Text>Can you provide me with today's date?</Text>
</User>
<Assistant>
  <Text>Today is <strong>{new Date().toLocaleDateString()}</strong>.</Text>
</Assistant>
```

In this example, the `Text` component is used within `User` and `Assistant` components to format the message content. The assistant's message demonstrates how `Text` can incorporate JSX to enhance message presentation, such as emphasizing part of the response.

## ToolBox and Tool

Within the `weave` ecosystem, the `ToolBox` and `Tool` components play a crucial role in extending the functionality of chat interactions with Language Learning Models (LLMs). These components allow developers to define and execute specific tasks or commands in response to user inputs or conversational contexts, enriching the chat experience with dynamic capabilities.

### ToolBox

The `ToolBox` component acts as a container for one or more `Tool` components. It represents a collection of tools or commands that can be triggered during the conversation, offering a modular way to organize functionalities related to specific topics or tasks.

#### Usage Example

```tsx
<System>
  <ToolBox>
    <Tool
      toolName="Fetch Weather Data"
      trigger="fetch weather"
      command="FETCH_WEATHER_DATA"
      params={{ city: "string" }}
      execute={async ({ city }) => {
        // Implementation to fetch weather data
      }}
    />
    {/* Additional Tool components can be nested here */}
  </ToolBox>
</System>
```

### Tool

The `Tool` component defines a specific command or operation that can be executed within the chat. Each `Tool` includes properties for naming, triggering conditions, command identification, parameters required for execution, and the execution logic itself.

#### Properties

- **toolName**: A descriptive name for the tool.
- **trigger**: A phrase or condition indicating when this tool can be utilized.
- **command**: A unique identifier for the tool, used for execution.
- **params**: An object defining the parameters needed for the tool's execution.
- **execute**: A function containing the logic to be executed when the tool is triggered.

#### Usage Example

```tsx
  <ToolBox>
    <Tool
      toolName="Check Sports Scores"
      trigger="check scores"
      command="CHECK_SPORTS_SCORES"
      params={{ game: "string" }}
      execute={async ({ game }) => {
        // Implementation to check sports scores
      }}
    />
  </ToolBox>
```

### Key Features

- **Modularity**: `ToolBox` and `Tool` components promote a modular approach to adding functionalities within the chat, making it easy to organize and manage different commands and operations.
- **Dynamic Interaction**: By incorporating these components, developers can create chats that respond to user queries with specific actions, such as fetching data or performing calculations, enhancing the interactivity of the chat.
- **Flexibility**: The `Tool` component's structure allows for a wide range of operations to be defined, from simple data retrieval to complex logic processing, accommodating various use cases.


## Utility Functions

`weave` includes a set of utility functions designed to support and enhance the functionality of its components. These functions facilitate tasks such as converting React components to strings, executing chat completions, and managing `ToolBox` components. Below, we explore these utilities and their roles within the library.

### getString

The `getString` function is a utility designed to convert React components and their children into string format. This function is particularly useful for processing JSX content into a format suitable for text-based operations, such as sending content to an LLM or rendering text in non-DOM environments.

#### Usage

```tsx
import { getString } from '@mages-guild/weave/lib/utils';

const jsxContent = <p>Hello, <strong>world</strong>!</p>;
const stringContent = getString(jsxContent);

console.log(stringContent); // Outputs: 'Hello, world!'
```

### execute

The `execute` function is central to the operation of `weave`, orchestrating the interaction between JSX-structured chat components and the LLM. It processes the structured conversation, executes any defined tools, and handles the chat completion process with the specified LLM model.

#### Usage

```tsx
import { execute } from '@mages-guild/weave';

// Assuming chatCompletionComponent is a JSX element structured with OpenAI.ChatCompletions and nested messages
const main = async () => {
  const [content, toolResult] = await execute(chatCompletionComponent);
  
  console.log(content); // LLM-generated content or tool execution result
  console.log(toolResult.data); // Data returned from tool execution, if applicable
};

main();
```

### findAllToolBoxes

The `findAllToolBoxes` function scans a React element tree to find and collect all `ToolBox` components. This utility supports the dynamic execution of tools by identifying all available tools within a given conversation structure.

#### Usage

```tsx
import { findAllToolBoxes } from '@mages-guild/weave/lib/core';

const toolBoxes = findAllToolBoxes(chatCompletionComponent);

console.log(toolBoxes); // Array of ToolBox components found within the provided component
```

### getToolBox

The `getToolBox` function extracts the tool configuration from a `ToolBox` component, creating a mapping of commands to their execution functions. This mapping is used to dynamically trigger tool execution based on commands identified within the chat conversation.

#### Usage

```tsx
import { getToolBox } from '@mages-guild/weave/lib/core';

const toolBoxMapping = getToolBox(toolBoxComponent);

console.log(toolBoxMapping); // Object mapping of commands to their execution functions
```


## API Reference

The `weave` library offers a comprehensive API that includes interfaces, enums, and type definitions, providing a robust foundation for building conversational interfaces with structured components and utility functions. This reference section gives you a detailed overview of the types and structures that make `weave` so versatile and powerful.

### Interfaces

Interfaces in `weave` define the shape of props and configurations for components and utilities, ensuring type safety and consistency across the library.

#### IToolBox

```tsx
interface IToolBox {
  children: React.ReactNode;
}
```

Represents the props for the `ToolBox` component, primarily used to group `Tool` components.

#### ITool

```tsx
interface ITool {
  toolName: string;
  trigger: string;
  command: string;
  params: object;
  execute: (params: any) => Promise<any>;
}
```

Defines the structure for a `Tool`, including its name, trigger, command identifier, parameters, and the execution function.

#### IMessage

```tsx
interface IMessage {
  children: React.ReactNode;
  name?: string;
}
```

Used by `System`, `User`, and `Assistant` components to structure message content within a conversation.

### Enums

Enums in `weave` provide predefined sets of options for configuring components, such as model types and response formats.

#### ChatModelsEnum

```tsx
export enum ChatModelsEnum {
  GPT_3P5_TURBO = 'gpt-3.5-turbo',
  GPT_3P5_TURBO_0125 = 'gpt-3.5-turbo-0125',
  GPT_4_0125_PREVIEW = 'gpt-4-0125-preview',
}
```

Specifies the available LLM models that can be used with `OpenAI.ChatCompletions`.
