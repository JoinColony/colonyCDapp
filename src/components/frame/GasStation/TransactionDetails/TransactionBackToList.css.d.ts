declare namespace TransactionBackToListCssNamespace {
  export interface ITransactionBackToListCss {
    details: string;
    returnToSummary: string;
  }
}

declare const TransactionBackToListCssModule: TransactionBackToListCssNamespace.ITransactionBackToListCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransactionBackToListCssNamespace.ITransactionBackToListCss;
};

export = TransactionBackToListCssModule;
