import * as React from 'react';
import { Text } from '../text';
import { Metadata } from '../metadata';

export interface IToolBox {
  children: string[] | string | React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[];
}

export const ToolBox = ({ children }: IToolBox) => {
  return <>{children}</>;
};

export interface ITool {
  toolName: string;
  trigger: string;
  command: string;
  params: {};
  execute: (params: any) => any;
}

export const Tool = ({ toolName, trigger, command, params, execute }: ITool) => {
  const favouredJSON = {
    command: command,
    params: params,
  }
  return(
    <>
    <Text>
      === Tool: [{toolName}] ===

      Trigger: {trigger}

      You must respond with the following JSON object as your command to the app:

      {JSON.stringify(favouredJSON, null, 2)}

      === [/{toolName}] ===
    </Text>
    </>
    
  )
}

export type ToolBoxElement = React.ReactElement<IToolBox>;

export function findAllToolBoxes(element: React.ReactNode, toolBoxes: ToolBoxElement[] = []): ToolBoxElement[] {
  // Check if the current element is a ToolBox and add it to the array if so
  if (React.isValidElement(element) && element.type === ToolBox) {
    toolBoxes.push(element as ToolBoxElement);
  }

  // If the element has children, search through them
  if (React.isValidElement(element) && React.Children.count((element as React.ReactElement<any>).props.children) > 0) {
    React.Children.forEach((element as React.ReactElement<any>).props.children, (child) => {
      findAllToolBoxes(child, toolBoxes);
    });
  }

  // Return the collected ToolBoxes
  return toolBoxes;
}



export const getToolBox = (jsxToolBoxComponent: React.ReactElement) => {
  let _toolBox = {};

  // Check if it's a ToolBox
  if (jsxToolBoxComponent.type === ToolBox) {
    // Iterate through each Tool
    React.Children.forEach(jsxToolBoxComponent.props.children, child => {
      if (child.type === Tool) {
        _toolBox = {
          ..._toolBox,
          [child.props.command]: child.props.execute,
        };
      }
    });
  }
  return _toolBox;
}