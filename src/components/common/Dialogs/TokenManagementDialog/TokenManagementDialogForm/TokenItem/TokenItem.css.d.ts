declare namespace TokenItemCssNamespace {
  export interface ITokenItemCss {
    checkbox: string;
    main: string;
    tokenChoice: string;
    tokenChoiceSymbol: string;
  }
}

declare const TokenItemCssModule: TokenItemCssNamespace.ITokenItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokenItemCssNamespace.ITokenItemCss;
};

export = TokenItemCssModule;
