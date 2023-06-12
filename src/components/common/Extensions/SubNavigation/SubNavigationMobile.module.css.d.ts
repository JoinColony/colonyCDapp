declare namespace SubNavigationMobileModuleCssNamespace {
  export interface ISubNavigationMobileModuleCss {
    listWrapper: string;
  }
}

declare const SubNavigationMobileModuleCssModule: SubNavigationMobileModuleCssNamespace.ISubNavigationMobileModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SubNavigationMobileModuleCssNamespace.ISubNavigationMobileModuleCss;
};

export = SubNavigationMobileModuleCssModule;
