declare namespace WalletCssNamespace {
  export interface IWalletCss {
    connectWalletButton: string;
    connectWalletButtonActive: string;
    connectWalletButtonLoading: string;
    gasStationReference: string;
    main: string;
    mappings: string;
    names: string;
    query700: string;
    readyTransactionsCount: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
    walletAddress: string;
    walletAddressActive: string;
    walletAutoLogin: string;
    walletLoader: string;
  }
}

declare const WalletCssModule: WalletCssNamespace.IWalletCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WalletCssNamespace.IWalletCss;
};

export = WalletCssModule;
