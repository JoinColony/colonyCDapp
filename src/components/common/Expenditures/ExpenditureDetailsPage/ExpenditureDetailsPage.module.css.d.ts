declare namespace ExpenditureDetailsPageModuleCssNamespace {
  export interface IExpenditureDetailsPageModuleCss {
    buttons: string;
    details: string;
  }
}

declare const ExpenditureDetailsPageModuleCssModule: ExpenditureDetailsPageModuleCssNamespace.IExpenditureDetailsPageModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExpenditureDetailsPageModuleCssNamespace.IExpenditureDetailsPageModuleCss;
};

export = ExpenditureDetailsPageModuleCssModule;
