declare namespace AmountTokensCssNamespace {
  export interface IAmountTokensCss {
    inputContainerMaxButton: string;
    networkFee: string;
    tokenAmount: string;
    tokenAmountContainer: string;
    tokenAmountInputContainer: string;
    tokenAmountSelect: string;
    tokenAmountUsd: string;
  }
}

declare const AmountTokensCssModule: AmountTokensCssNamespace.IAmountTokensCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AmountTokensCssNamespace.IAmountTokensCss;
};

export = AmountTokensCssModule;
