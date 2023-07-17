declare namespace TransactionTypesSectionCssNamespace {
  export interface ITransactionTypesSectionCss {
    contractFunctionSelectorContainer: string;
    error: string;
    labelDescription: string;
    singleUserPickerContainer: string;
    spinner: string;
  }
}

declare const TransactionTypesSectionCssModule: TransactionTypesSectionCssNamespace.ITransactionTypesSectionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransactionTypesSectionCssNamespace.ITransactionTypesSectionCss;
};

export = TransactionTypesSectionCssModule;
