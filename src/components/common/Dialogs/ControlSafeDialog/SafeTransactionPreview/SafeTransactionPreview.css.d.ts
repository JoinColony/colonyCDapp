declare namespace SafeTransactionPreviewCssNamespace {
  export interface ISafeTransactionPreviewCss {
    avatar: string;
    contractName: string;
    footer: string;
    heading: string;
    itemValue: string;
    motionHeading: string;
    nftContainer: string;
    rawTransactionValues: string;
    tabContentClosed: string;
    tokenAmount: string;
    transactionDetailsSection: string;
    transactionTitle: string;
  }
}

declare const SafeTransactionPreviewCssModule: SafeTransactionPreviewCssNamespace.ISafeTransactionPreviewCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SafeTransactionPreviewCssNamespace.ISafeTransactionPreviewCss;
};

export = SafeTransactionPreviewCssModule;
