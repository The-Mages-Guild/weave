import * as React from 'react';
export interface IMarkdown {
    children: string[] | string | React.ReactNode | React.ReactNode[];
}
export declare const Markdown: ({ children }: IMarkdown) => import("react/jsx-runtime").JSX.Element;
