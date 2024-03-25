import * as React from 'react';
export interface IMessage {
    children: string[] | string | React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[];
    name?: string;
}
export declare const System: ({ name, children }: IMessage) => import("react/jsx-runtime").JSX.Element;
export declare const User: ({ name, children }: IMessage) => import("react/jsx-runtime").JSX.Element;
export declare const Assistant: ({ name, children }: IMessage) => import("react/jsx-runtime").JSX.Element;
export declare const getMessageRole: (child: React.ReactElement) => "system" | "user" | "assistant";
export declare const getMessages: (jsxMessagesComponent: React.ReactElement) => any;
