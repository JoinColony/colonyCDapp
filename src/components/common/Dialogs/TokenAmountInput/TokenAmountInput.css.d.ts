declare namespace TokenAmountInputCssNamespace {
  export interface ITokenAmountInputCss {
    tokenAmount: string;
    tokenAmountContainer: string;
    tokenAmountInputContainer: string;
    tokenAmountSelect: string;
    tokenAmountUsd: string;
  }
}

declare const TokenAmountInputCssModule: TokenAmountInputCssNamespace.ITokenAmountInputCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokenAmountInputCssNamespace.ITokenAmountInputCss;
};

export = TokenAmountInputCssModule;
