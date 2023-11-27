declare namespace TransactionStatusCssNamespace {
  export interface ITransactionStatusCss {
    main: string;
    statusTheme: string;
    themeFailed: string;
    themePending: string;
    themeSucceeded: string;
    themeSystemMessage: string;
  }
}

declare const TransactionStatusCssModule: TransactionStatusCssNamespace.ITransactionStatusCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransactionStatusCssNamespace.ITransactionStatusCss;
};

export = TransactionStatusCssModule;
