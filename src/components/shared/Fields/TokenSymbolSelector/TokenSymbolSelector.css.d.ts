declare namespace TokenSymbolSelectorCssNamespace {
  export interface ITokenSymbolSelectorCss {
    labelElement: string;
    optionElement: string;
    symbol: string;
  }
}

declare const TokenSymbolSelectorCssModule: TokenSymbolSelectorCssNamespace.ITokenSymbolSelectorCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokenSymbolSelectorCssNamespace.ITokenSymbolSelectorCss;
};

export = TokenSymbolSelectorCssModule;
