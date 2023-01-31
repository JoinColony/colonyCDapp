declare namespace OneTxPaymentUpgradeCssNamespace {
  export interface IOneTxPaymentUpgradeCss {
    controls: string;
    upgradeBanner: string;
    upgradeBannerContainer: string;
  }
}

declare const OneTxPaymentUpgradeCssModule: OneTxPaymentUpgradeCssNamespace.IOneTxPaymentUpgradeCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: OneTxPaymentUpgradeCssNamespace.IOneTxPaymentUpgradeCss;
};

export = OneTxPaymentUpgradeCssModule;
