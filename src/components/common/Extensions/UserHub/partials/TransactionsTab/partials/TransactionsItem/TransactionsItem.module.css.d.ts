declare namespace TransactionsItemModuleCssNamespace {
  export interface ITransactionsItemModuleCss {
    listItem: string;
  }
}

declare const TransactionsItemModuleCssModule: TransactionsItemModuleCssNamespace.ITransactionsItemModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransactionsItemModuleCssNamespace.ITransactionsItemModuleCss;
};

export = TransactionsItemModuleCssModule;
