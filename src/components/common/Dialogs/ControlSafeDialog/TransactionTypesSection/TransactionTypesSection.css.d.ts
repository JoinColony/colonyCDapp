declare namespace TransactionTypesSectionCssNamespace {
  export interface ITransactionTypesSectionCss {
    error: string;
  }
}

declare const TransactionTypesSectionCssModule: TransactionTypesSectionCssNamespace.ITransactionTypesSectionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransactionTypesSectionCssNamespace.ITransactionTypesSectionCss;
};

export = TransactionTypesSectionCssModule;
