declare namespace ExpenditureFormModuleCssNamespace {
  export interface IExpenditureFormModuleCss {
    amountField: string;
    buttons: string;
    cancelButton: string;
    dateTime: string;
    domainSelection: string;
    field: string;
    typeTabs: string;
  }
}

declare const ExpenditureFormModuleCssModule: ExpenditureFormModuleCssNamespace.IExpenditureFormModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExpenditureFormModuleCssNamespace.IExpenditureFormModuleCss;
};

export = ExpenditureFormModuleCssModule;
