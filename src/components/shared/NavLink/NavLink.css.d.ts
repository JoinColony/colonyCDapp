declare namespace NavLinkCssNamespace {
  export interface INavLinkCss {
    active: string;
  }
}

declare const NavLinkCssModule: NavLinkCssNamespace.INavLinkCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NavLinkCssNamespace.INavLinkCss;
};

export = NavLinkCssModule;
