declare namespace WalletPopoverModuleCssNamespace {
  export interface IWalletPopoverModuleCss {
    mobileButtons: string;
    walletPopover: string;
    walletPopoverColumn: string;
  }
}

declare const WalletPopoverModuleCssModule: WalletPopoverModuleCssNamespace.IWalletPopoverModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: WalletPopoverModuleCssNamespace.IWalletPopoverModuleCss;
};

export = WalletPopoverModuleCssModule;
