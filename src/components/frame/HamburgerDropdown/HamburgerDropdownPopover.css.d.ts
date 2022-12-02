declare namespace HamburgerDropdownPopoverCssNamespace {
  export interface IHamburgerDropdownPopoverCss {
    menu: string;
  }
}

declare const HamburgerDropdownPopoverCssModule: HamburgerDropdownPopoverCssNamespace.IHamburgerDropdownPopoverCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HamburgerDropdownPopoverCssNamespace.IHamburgerDropdownPopoverCss;
};

export = HamburgerDropdownPopoverCssModule;
