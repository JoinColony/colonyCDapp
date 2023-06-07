declare namespace SubNavigationItemModuleCssNamespace {
  export interface ISubNavigationItemModuleCss {
    activeButton: string;
    button: string;
    tooltipContainer: string;
  }
}

declare const SubNavigationItemModuleCssModule: SubNavigationItemModuleCssNamespace.ISubNavigationItemModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SubNavigationItemModuleCssNamespace.ISubNavigationItemModuleCss;
};

export = SubNavigationItemModuleCssModule;
