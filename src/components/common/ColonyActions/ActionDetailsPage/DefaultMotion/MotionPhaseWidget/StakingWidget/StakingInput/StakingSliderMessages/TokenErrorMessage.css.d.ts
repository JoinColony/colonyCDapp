declare namespace TokenErrorMessageCssNamespace {
  export interface ITokenErrorMessageCss {
    activateTokens: string;
    validationErrorValues: string;
  }
}

declare const TokenErrorMessageCssModule: TokenErrorMessageCssNamespace.ITokenErrorMessageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokenErrorMessageCssNamespace.ITokenErrorMessageCss;
};

export = TokenErrorMessageCssModule;
