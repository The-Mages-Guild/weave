import * as React from 'react';
import { getString } from "../../utils";
import { Text } from "../text";

const messageComponentStringify = (role: 'system' | 'user' | 'assistant', children: string, name?: string) => {
  const string = getString(children);
  return JSON.stringify({
    role: role,
    content: `${string}`,
    name
  });
}

type Roles = 'system' | 'user' | 'assistant';

interface ICoreMessage {
  role: Roles;
  children: string[] | string | React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[];
  name?: string;
}

export interface IMessage {
  children: string[] | string | React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[];
  name?: string;
}

const CoreMessage = ({ role, name, children }: ICoreMessage) => {
  const string = Array.isArray(children) ? children.join("") : getString(children);
  return (
    <Text>
      {messageComponentStringify(role, string, name)}
    </Text>
  );
};

export const System = ({name, children}: IMessage) => {
  return (
    <CoreMessage
      role="system"
      name={name}
    >
      {children}
    </CoreMessage>
  )
}

export const User = ({name, children}: IMessage) => {
  return (
    <CoreMessage
      role="user"
      name={name}
    >
      {children}
    </CoreMessage>
  )
}

export const Assistant = ({name, children}: IMessage) => {
  return (
    <CoreMessage
      role="assistant"
      name={name}
    >
      {children}
    </CoreMessage>
  )
}


export const getMessageRole = (child: React.ReactElement) => {
  if (child.type === User) {
    return 'user';
  }
  if (child.type === Assistant) {
    return 'assistant';
  }
  if (child.type === System) {
    return 'system';
  }
  return 'system';
}


export const getMessages = (jsxMessagesComponent: React.ReactElement) => {



  return React.Children.map(jsxMessagesComponent.props.children, child => {
    const name = child.props.name;
    if (child.type === User || child.type === Assistant || child.type === System) {
      if (name) {
        return {
          role: getMessageRole(child),
          content: `${getString(child.props.children)}`,
          name,
        }
      }
      return {
          role: getMessageRole(child),
          content: `${getString(child.props.children)}`,
        }
    }
  });
}
