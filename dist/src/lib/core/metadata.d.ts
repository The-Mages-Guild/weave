import * as React from 'react';
export interface IMetadata {
    [key: string]: any;
    key: string;
}
export declare const Metadata: (props: IMetadata) => React.ReactElement<IMetadata, string | React.JSXElementConstructor<any>>;
