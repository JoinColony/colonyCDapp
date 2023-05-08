declare namespace TokenSelectorCssNamespace {
  export interface ITokenSelectorCss {
    inputWrapper: string;
    mappings: string;
    names: string;
    query428: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const TokenSelectorCssModule: TokenSelectorCssNamespace.ITokenSelectorCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokenSelectorCssNamespace.ITokenSelectorCss;
};

export = TokenSelectorCssModule;
