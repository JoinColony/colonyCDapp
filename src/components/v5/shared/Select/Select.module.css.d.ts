declare namespace SelectModuleCssNamespace {
  export interface ISelectModuleCss {
    button: string;
    container: string;
    icon: string;
    li: string;
    options: string;
    show: string;
  }
}

declare const SelectModuleCssModule: SelectModuleCssNamespace.ISelectModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SelectModuleCssNamespace.ISelectModuleCss;
};

export = SelectModuleCssModule;
