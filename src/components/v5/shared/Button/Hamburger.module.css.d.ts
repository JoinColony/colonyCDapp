declare namespace HamburgerModuleCssNamespace {
  export interface IHamburgerModuleCss {
    hamburger: string;
  }
}

declare const HamburgerModuleCssModule: HamburgerModuleCssNamespace.IHamburgerModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HamburgerModuleCssNamespace.IHamburgerModuleCss;
};

export = HamburgerModuleCssModule;
