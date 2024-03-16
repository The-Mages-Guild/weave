import * as React from 'react';



export interface IMetadata {
  [key: string]: any;
  key: string;
}

export const Metadata = (props: IMetadata) => {
  return React.createElement('Metadata', props, null);
}
