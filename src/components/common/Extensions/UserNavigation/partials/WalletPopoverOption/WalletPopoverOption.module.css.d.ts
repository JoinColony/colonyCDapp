declare namespace WalletPopoverOptionModuleCssNamespace {
  export interface IWalletPopoverOptionModuleCss {
    walletPopoverOption: string;
  }
}

declare const WalletPopoverOptionModuleCssModule: WalletPopoverOptionModuleCssNamespace.IWalletPopoverOptionModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WalletPopoverOptionModuleCssNamespace.IWalletPopoverOptionModuleCss;
};

export = WalletPopoverOptionModuleCssModule;
