declare namespace TransactionNotFoundCssNamespace {
  export interface ITransactionNotFoundCss {
    divider: string;
    heading: string;
    notFoundContainer: string;
  }
}

declare const TransactionNotFoundCssModule: TransactionNotFoundCssNamespace.ITransactionNotFoundCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransactionNotFoundCssNamespace.ITransactionNotFoundCss;
};

export = TransactionNotFoundCssModule;
