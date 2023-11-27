declare namespace AmountTagCssNamespace {
  export interface IAmountTagCss {
    main: string;
  }
}

declare const AmountTagCssModule: AmountTagCssNamespace.IAmountTagCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AmountTagCssNamespace.IAmountTagCss;
};

export = AmountTagCssModule;
