declare namespace TransactionMetaCssNamespace {
  export interface ITransactionMetaCss {
    blockscoutLink: string;
    items: string;
    main: string;
  }
}

declare const TransactionMetaCssModule: TransactionMetaCssNamespace.ITransactionMetaCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransactionMetaCssNamespace.ITransactionMetaCss;
};

export = TransactionMetaCssModule;
