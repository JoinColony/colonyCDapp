declare namespace HamburgerMenuCssNamespace {
  export interface IHamburgerMenuCss {
    main: string;
    menuLine: string;
    menuOpen: string;
  }
}

declare const HamburgerMenuCssModule: HamburgerMenuCssNamespace.IHamburgerMenuCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HamburgerMenuCssNamespace.IHamburgerMenuCss;
};

export = HamburgerMenuCssModule;
