declare namespace NavModuleCssNamespace {
  export interface INavModuleCss {
    navLink: string;
    subMenu: string;
    subMenuMobile: string;
  }
}

declare const NavModuleCssModule: NavModuleCssNamespace.INavModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NavModuleCssNamespace.INavModuleCss;
};

export = NavModuleCssModule;
