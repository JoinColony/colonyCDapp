declare namespace UserNavigationCssNamespace {
  export interface IUserNavigationCss {
    connectWalletButton: string;
    connectWalletButtonActive: string;
    connectWalletButtonLoading: string;
    elementWrapper: string;
    main: string;
    networkInfo: string;
    notificationsButton: string;
    notificationsHighlight: string;
    notificationsIcon: string;
    notificationsIconActive: string;
    readyTransactionsCount: string;
    reputation: string;
    walletAddress: string;
    walletAddressActive: string;
    walletAddressTemp: string;
    walletAutoLogin: string;
    walletWrapper: string;
    wrongNetwork: string;
  }
}

declare const UserNavigationCssModule: UserNavigationCssNamespace.IUserNavigationCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserNavigationCssNamespace.IUserNavigationCss;
};

export = UserNavigationCssModule;
