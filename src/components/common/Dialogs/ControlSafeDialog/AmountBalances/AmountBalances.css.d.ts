declare namespace AmountBalancesCssNamespace {
  export interface IAmountBalancesCss {
    inputContainerMaxButton: string;
    networkFee: string;
    tokenAmount: string;
    tokenAmountContainer: string;
    tokenAmountInputContainer: string;
    tokenAmountSelect: string;
    tokenAmountUsd: string;
  }
}

declare const AmountBalancesCssModule: AmountBalancesCssNamespace.IAmountBalancesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AmountBalancesCssNamespace.IAmountBalancesCss;
};

export = AmountBalancesCssModule;
