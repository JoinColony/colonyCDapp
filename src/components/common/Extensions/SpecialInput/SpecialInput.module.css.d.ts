declare namespace SpecialInputModuleCssNamespace {
  export interface ISpecialInputModuleCss {
    field: string;
    input: string;
    wrapper: string;
  }
}

declare const SpecialInputModuleCssModule: SpecialInputModuleCssNamespace.ISpecialInputModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SpecialInputModuleCssNamespace.ISpecialInputModuleCss;
};

export = SpecialInputModuleCssModule;
