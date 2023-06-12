declare namespace DropdownContentModuleCssNamespace {
  export interface IDropdownContentModuleCss {
    buttonWrapper: string;
    infoWrapper: string;
    listWrapper: string;
  }
}

declare const DropdownContentModuleCssModule: DropdownContentModuleCssNamespace.IDropdownContentModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DropdownContentModuleCssNamespace.IDropdownContentModuleCss;
};

export = DropdownContentModuleCssModule;
