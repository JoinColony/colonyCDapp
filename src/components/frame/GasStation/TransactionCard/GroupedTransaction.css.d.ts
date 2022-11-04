declare namespace GroupedTransactionCssNamespace {
  export interface IGroupedTransactionCss {
    description: string;
    li: string;
    main: string;
    summary: string;
    transactionList: string;
  }
}

declare const GroupedTransactionCssModule: GroupedTransactionCssNamespace.IGroupedTransactionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GroupedTransactionCssNamespace.IGroupedTransactionCss;
};

export = GroupedTransactionCssModule;
