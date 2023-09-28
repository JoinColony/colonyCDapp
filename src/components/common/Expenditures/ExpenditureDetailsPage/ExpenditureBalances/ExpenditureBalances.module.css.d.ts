declare namespace ExpenditureBalancesModuleCssNamespace {
  export interface IExpenditureBalancesModuleCss {
    balance: string;
    balances: string;
  }
}

declare const ExpenditureBalancesModuleCssModule: ExpenditureBalancesModuleCssNamespace.IExpenditureBalancesModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExpenditureBalancesModuleCssNamespace.IExpenditureBalancesModuleCss;
};

export = ExpenditureBalancesModuleCssModule;
