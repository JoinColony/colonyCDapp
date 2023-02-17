declare namespace TokenActivationPopoverCssNamespace {
  export interface ITokenActivationPopoverCss {
    verticalOffset: string;
  }
}

declare const TokenActivationPopoverCssModule: TokenActivationPopoverCssNamespace.ITokenActivationPopoverCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokenActivationPopoverCssNamespace.ITokenActivationPopoverCss;
};

export = TokenActivationPopoverCssModule;
