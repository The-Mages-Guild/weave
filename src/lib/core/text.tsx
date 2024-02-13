import * as React from 'react';
import { Markdown } from './markdown';

export interface IText {
  children: string[] | string | React.ReactNode | React.ReactNode[];
}

export const Text = ({children}: IText) => (<Markdown>{children}</Markdown>);