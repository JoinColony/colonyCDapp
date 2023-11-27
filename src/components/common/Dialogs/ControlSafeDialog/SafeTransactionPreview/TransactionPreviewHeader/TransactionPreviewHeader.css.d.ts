declare namespace TransactionPreviewHeaderCssNamespace {
  export interface ITransactionPreviewHeaderCss {
    tabButton: string;
    toggleTabIcon: string;
    transactionHeading: string;
    transactionHeadingOpen: string;
  }
}

declare const TransactionPreviewHeaderCssModule: TransactionPreviewHeaderCssNamespace.ITransactionPreviewHeaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransactionPreviewHeaderCssNamespace.ITransactionPreviewHeaderCss;
};

export = TransactionPreviewHeaderCssModule;
