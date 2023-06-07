declare namespace SubNavigationItemMobileModuleCssNamespace {
  export interface ISubNavigationItemMobileModuleCss {
    activeButton: string;
    button: string;
    dropdownContent: string;
    tooltipContainer: string;
  }
}

declare const SubNavigationItemMobileModuleCssModule: SubNavigationItemMobileModuleCssNamespace.ISubNavigationItemMobileModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SubNavigationItemMobileModuleCssNamespace.ISubNavigationItemMobileModuleCss;
};

export = SubNavigationItemMobileModuleCssModule;
