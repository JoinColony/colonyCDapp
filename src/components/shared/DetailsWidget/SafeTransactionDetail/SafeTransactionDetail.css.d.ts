declare namespace SafeTransactionDetailCssNamespace {
  export interface ISafeTransactionDetailCss {
    address: string;
    arrayContainer: string;
    arrayItem: string;
    contractAddress: string;
    contractItem: string;
    data: string;
    ether: string;
    functionArg: string;
    main: string;
    nft: string;
    recipient: string;
    sectionOpen: string;
    title: string;
    tokenAvatar: string;
    tokenContainer: string;
    transactionTag: string;
    value: string;
  }
}

declare const SafeTransactionDetailCssModule: SafeTransactionDetailCssNamespace.ISafeTransactionDetailCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SafeTransactionDetailCssNamespace.ISafeTransactionDetailCss;
};

export = SafeTransactionDetailCssModule;
