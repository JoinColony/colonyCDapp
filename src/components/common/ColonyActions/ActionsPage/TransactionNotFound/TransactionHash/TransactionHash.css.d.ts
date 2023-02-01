declare namespace TransactionHashCssNamespace {
  export interface ITransactionHashCss {
    main: string;
    title: string;
    transaction: string;
    transactionHash: string;
    transactionShadow: string;
  }
}

declare const TransactionHashCssModule: TransactionHashCssNamespace.ITransactionHashCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransactionHashCssNamespace.ITransactionHashCss;
};

export = TransactionHashCssModule;
