declare namespace TokenSelectorCssNamespace {
  export interface ITokenSelectorCss {
    inputWrapper: string;
  }
}

declare const TokenSelectorCssModule: TokenSelectorCssNamespace.ITokenSelectorCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokenSelectorCssNamespace.ITokenSelectorCss;
};

export = TokenSelectorCssModule;
