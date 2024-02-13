import * as React from 'react';

interface IDumbCharacterCount {
  limit?: number;
  children: string;
}

export const DumbCharacterCount = ({limit, children}: IDumbCharacterCount) => { 
  return limit === undefined ?
    children :
    children.length > limit ? 
      <>{`${children}`}</> : 
      null;
};