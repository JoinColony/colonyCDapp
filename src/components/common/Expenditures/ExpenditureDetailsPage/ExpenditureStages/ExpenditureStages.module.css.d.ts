declare namespace ExpenditureStagesModuleCssNamespace {
  export interface IExpenditureStagesModuleCss {
    stage: string;
    stages: string;
  }
}

declare const ExpenditureStagesModuleCssModule: ExpenditureStagesModuleCssNamespace.IExpenditureStagesModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExpenditureStagesModuleCssNamespace.IExpenditureStagesModuleCss;
};

export = ExpenditureStagesModuleCssModule;
