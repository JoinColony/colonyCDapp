declare namespace ExpenditurePayoutsModuleCssNamespace {
  export interface IExpenditurePayoutsModuleCss {
    payout: string;
    payouts: string;
  }
}

declare const ExpenditurePayoutsModuleCssModule: ExpenditurePayoutsModuleCssNamespace.IExpenditurePayoutsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExpenditurePayoutsModuleCssNamespace.IExpenditurePayoutsModuleCss;
};

export = ExpenditurePayoutsModuleCssModule;
