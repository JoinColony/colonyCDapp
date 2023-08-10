declare namespace SafeTransactionPreviewCssNamespace {
  export interface ISafeTransactionPreviewCss {
    avatar: string;
    contractName: string;
    deleteTabIcon: string;
    deleteTabTooltip: string;
    footer: string;
    heading: string;
    itemValue: string;
    motionHeading: string;
    nftContainer: string;
    rawTransactionValues: string;
    tabButton: string;
    tabContentClosed: string;
    toggleTabIcon: string;
    tokenAmount: string;
    transactionDetailsSection: string;
    transactionHeading: string;
    transactionHeadingOpen: string;
    transactionTitle: string;
  }
}

declare const SafeTransactionPreviewCssModule: SafeTransactionPreviewCssNamespace.ISafeTransactionPreviewCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SafeTransactionPreviewCssNamespace.ISafeTransactionPreviewCss;
};

export = SafeTransactionPreviewCssModule;
