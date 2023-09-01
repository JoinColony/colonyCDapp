declare namespace StakeExpenditureDialogModuleCssNamespace {
  export interface IStakeExpenditureDialogModuleCss {
    loader: string;
    requiredStake: string;
  }
}

declare const StakeExpenditureDialogModuleCssModule: StakeExpenditureDialogModuleCssNamespace.IStakeExpenditureDialogModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StakeExpenditureDialogModuleCssNamespace.IStakeExpenditureDialogModuleCss;
};

export = StakeExpenditureDialogModuleCssModule;
