declare namespace NavItemModuleCssNamespace {
  export interface INavItemModuleCss {
    navLink: string;
  }
}

declare const NavItemModuleCssModule: NavItemModuleCssNamespace.INavItemModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NavItemModuleCssNamespace.INavItemModuleCss;
};

export = NavItemModuleCssModule;
