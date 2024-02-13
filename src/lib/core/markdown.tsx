import * as React from 'react';

export interface IMarkdown {
  children: string[] | string | React.ReactNode | React.ReactNode[];
}

export const Markdown = ({ children }: IMarkdown) => {
  const childArray = Array.isArray(children) ? children : [children];
  const childString = childArray.map(child => {
    if (typeof child === 'string') {
      return child;
    } else if (React.isValidElement(child)) {
      return child.props.children;
    } else {
      return '\n';
    }
  }).join('\n');
  return (
    <>
      {childString}
    </>
  );
};