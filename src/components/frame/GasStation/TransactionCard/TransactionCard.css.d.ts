declare namespace TransactionCardCssNamespace {
  export interface ITransactionCardCss {
    button: string;
    description: string;
    main: string;
    summary: string;
  }
}

declare const TransactionCardCssModule: TransactionCardCssNamespace.ITransactionCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransactionCardCssNamespace.ITransactionCardCss;
};

export = TransactionCardCssModule;
