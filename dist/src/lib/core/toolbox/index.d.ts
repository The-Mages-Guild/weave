import * as React from 'react';
export interface IToolBox {
    children: string[] | string | React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[];
}
export declare const ToolBox: ({ children }: IToolBox) => import("react/jsx-runtime").JSX.Element;
export interface ITool {
    toolName: string;
    trigger: string;
    command: string;
    params: {};
    execute: (params: any) => any;
}
export declare const Tool: ({ toolName, trigger, command, params, execute }: ITool) => import("react/jsx-runtime").JSX.Element;
export type ToolBoxElement = React.ReactElement<IToolBox>;
export declare function findAllToolBoxes(element: React.ReactNode, toolBoxes?: ToolBoxElement[]): ToolBoxElement[];
export declare const getToolBox: (jsxToolBoxComponent: React.ReactElement) => {};
