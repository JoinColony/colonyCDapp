declare namespace ReputationTabModuleCssNamespace {
  export interface IReputationTabModuleCss {
    icon: string;
    numeral: string;
    reputationValue: string;
    row: string;
    rowName: string;
  }
}

declare const ReputationTabModuleCssModule: ReputationTabModuleCssNamespace.IReputationTabModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ReputationTabModuleCssNamespace.IReputationTabModuleCss;
};

export = ReputationTabModuleCssModule;
