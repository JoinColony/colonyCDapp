declare namespace ControlSafeFormCssNamespace {
  export interface IControlSafeFormCss {
    addTransaction: string;
    footer: string;
    heading: string;
    nftValue: string;
    rawTransactionValues: string;
    safePicker: string;
    tokenAmount: string;
    transactionDetailsSection: string;
    transactionTitle: string;
    upgradePath: string;
    upgradeWarning: string;
    warningIcon: string;
    wideButton: string;
  }
}

declare const ControlSafeFormCssModule: ControlSafeFormCssNamespace.IControlSafeFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ControlSafeFormCssNamespace.IControlSafeFormCss;
};

export = ControlSafeFormCssModule;
