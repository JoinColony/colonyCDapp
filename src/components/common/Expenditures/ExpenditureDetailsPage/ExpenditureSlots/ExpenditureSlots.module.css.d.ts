declare namespace ExpenditureSlotsModuleCssNamespace {
  export interface IExpenditureSlotsModuleCss {
    slot: string;
    slots: string;
  }
}

declare const ExpenditureSlotsModuleCssModule: ExpenditureSlotsModuleCssNamespace.IExpenditureSlotsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExpenditureSlotsModuleCssNamespace.IExpenditureSlotsModuleCss;
};

export = ExpenditureSlotsModuleCssModule;
