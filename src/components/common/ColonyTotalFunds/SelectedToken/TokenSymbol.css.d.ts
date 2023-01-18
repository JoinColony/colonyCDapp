declare namespace TokenSymbolCssNamespace {
  export interface ITokenSymbolCss {
    tokenLockWrapper: string;
  }
}

declare const TokenSymbolCssModule: TokenSymbolCssNamespace.ITokenSymbolCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokenSymbolCssNamespace.ITokenSymbolCss;
};

export = TokenSymbolCssModule;
