declare namespace TransactionTypesSectionCssNamespace {
  export interface ITransactionTypesSectionCss {
    error: string;
    labelDescription: string;
    singleUserPickerContainer: string;
    spinner: string;
    tabContentClosed: string;
    transactionTypeSelectContainer: string;
    warningContainer: string;
    warningIcon: string;
    warningSafeChainName: string;
  }
}

declare const TransactionTypesSectionCssModule: TransactionTypesSectionCssNamespace.ITransactionTypesSectionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransactionTypesSectionCssNamespace.ITransactionTypesSectionCss;
};

export = TransactionTypesSectionCssModule;
