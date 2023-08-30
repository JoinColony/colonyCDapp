declare namespace ExpenditureAdvanceButtonModuleCssNamespace {
  export interface IExpenditureAdvanceButtonModuleCss {
    buttons: string;
  }
}

declare const ExpenditureAdvanceButtonModuleCssModule: ExpenditureAdvanceButtonModuleCssNamespace.IExpenditureAdvanceButtonModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExpenditureAdvanceButtonModuleCssNamespace.IExpenditureAdvanceButtonModuleCss;
};

export = ExpenditureAdvanceButtonModuleCssModule;
