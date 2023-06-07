declare namespace WalletConnectedTopMenuModuleCssNamespace {
  export interface IWalletConnectedTopMenuModuleCss {
    mobileButtons: string;
  }
}

declare const WalletConnectedTopMenuModuleCssModule: WalletConnectedTopMenuModuleCssNamespace.IWalletConnectedTopMenuModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WalletConnectedTopMenuModuleCssNamespace.IWalletConnectedTopMenuModuleCss;
};

export = WalletConnectedTopMenuModuleCssModule;
