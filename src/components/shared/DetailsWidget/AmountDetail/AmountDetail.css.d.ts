declare namespace AmountDetailCssNamespace {
  export interface IAmountDetailCss {
    tokenContainer: string;
  }
}

declare const AmountDetailCssModule: AmountDetailCssNamespace.IAmountDetailCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AmountDetailCssNamespace.IAmountDetailCss;
};

export = AmountDetailCssModule;
