declare namespace AmountTokensCssNamespace {
  export interface IAmountTokensCss {
    inputContainer: string;
    main: string;
  }
}

declare const AmountTokensCssModule: AmountTokensCssNamespace.IAmountTokensCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AmountTokensCssNamespace.IAmountTokensCss;
};

export = AmountTokensCssModule;
