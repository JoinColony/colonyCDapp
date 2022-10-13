declare namespace NavItemCssNamespace {
  export interface INavItemCss {
    active: string;
    extra: string;
    main: string;
    showDot: string;
    text: string;
  }
}

declare const NavItemCssModule: NavItemCssNamespace.INavItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NavItemCssNamespace.INavItemCss;
};

export = NavItemCssModule;
