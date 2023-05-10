declare namespace ManageFundsLinkCssNamespace {
  export interface IManageFundsLinkCss {
    manageFundsLink: string;
    mappings: string;
    names: string;
    query428: string;
    rightArrowDisplay: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const ManageFundsLinkCssModule: ManageFundsLinkCssNamespace.IManageFundsLinkCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ManageFundsLinkCssNamespace.IManageFundsLinkCss;
};

export = ManageFundsLinkCssModule;
