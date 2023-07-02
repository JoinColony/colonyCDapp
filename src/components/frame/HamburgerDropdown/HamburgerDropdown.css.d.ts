declare namespace HamburgerDropdownCssNamespace {
  export interface IHamburgerDropdownCss {
    activeDropdown: string;
    hamburgerButton: string;
    mappings: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const HamburgerDropdownCssModule: HamburgerDropdownCssNamespace.IHamburgerDropdownCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HamburgerDropdownCssNamespace.IHamburgerDropdownCss;
};

export = HamburgerDropdownCssModule;
