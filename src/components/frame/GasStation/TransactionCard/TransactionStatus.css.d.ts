declare namespace TransactionStatusCssNamespace {
  export interface ITransactionStatusCss {
    completed: string;
    counter: string;
    failed: string;
    interaction: string;
    main: string;
    mainStatusReady: string;
    mappings: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    statusIconContainer: string;
    statusIconContainerReady: string;
    tooltip: string;
    version: string;
  }
}

declare const TransactionStatusCssModule: TransactionStatusCssNamespace.ITransactionStatusCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransactionStatusCssNamespace.ITransactionStatusCss;
};

export = TransactionStatusCssModule;
