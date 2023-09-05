declare namespace TransactionHeaderCssNamespace {
  export interface ITransactionHeaderCss {
    deleteTabIcon: string;
    deleteTabTooltip: string;
    tabButton: string;
    tabButtonIcon: string;
    toggleTabIcon: string;
    transactionHeading: string;
    transactionHeadingOpen: string;
  }
}

declare const TransactionHeaderCssModule: TransactionHeaderCssNamespace.ITransactionHeaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransactionHeaderCssNamespace.ITransactionHeaderCss;
};

export = TransactionHeaderCssModule;
