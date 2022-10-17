declare namespace SelectListBoxCssNamespace {
  export interface ISelectListBoxCss {
    alignOptionsCenter: string;
    alignOptionsLeft: string;
    alignOptionsRight: string;
    baseTheme: string;
    themeAlt: string;
    themeDefault: string;
    themeGrey: string;
    themeGrid: string;
    widthFluid: string;
    widthStrict: string;
  }
}

declare const SelectListBoxCssModule: SelectListBoxCssNamespace.ISelectListBoxCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SelectListBoxCssNamespace.ISelectListBoxCss;
};

export = SelectListBoxCssModule;
