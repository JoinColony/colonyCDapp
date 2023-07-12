declare namespace ControlSafeFormCssNamespace {
  export interface IControlSafeFormCss {
    addTransaction: string;
    deleteTabIcon: string;
    deleteTabTooltip: string;
    footer: string;
    heading: string;
    nftValue: string;
    rawTransactionValues: string;
    safePicker: string;
    tabButton: string;
    tabButtonIcon: string;
    tabContentClosed: string;
    toggleTabIcon: string;
    tokenAmount: string;
    transactionDetailsSection: string;
    transactionHeading: string;
    transactionHeadingOpen: string;
    transactionTitle: string;
    transactionTypeSelectContainer: string;
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
