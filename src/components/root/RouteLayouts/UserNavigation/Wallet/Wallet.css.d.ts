declare namespace WalletCssNamespace {
  export interface IWalletCss {
    connectWalletButton: string;
    connectWalletButtonActive: string;
    connectWalletButtonLoading: string;
    walletAddress: string;
    walletAddressActive: string;
    walletAddressTemp: string;
    walletAutoLogin: string;
    walletWrapper: string;
  }
}

declare const WalletCssModule: WalletCssNamespace.IWalletCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WalletCssNamespace.IWalletCss;
};

export = WalletCssModule;
