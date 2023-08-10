declare namespace ExpendituresPageModuleCssNamespace {
  export interface IExpendituresPageModuleCss {
    pageWrapper: string;
  }
}

declare const ExpendituresPageModuleCssModule: ExpendituresPageModuleCssNamespace.IExpendituresPageModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExpendituresPageModuleCssNamespace.IExpendituresPageModuleCss;
};

export = ExpendituresPageModuleCssModule;
