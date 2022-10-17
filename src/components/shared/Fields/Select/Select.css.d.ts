declare namespace SelectCssNamespace {
  export interface ISelectCss {
    activeOption: string;
    baseSelect: string;
    inputWrapper: string;
    main: string;
    select: string;
    selectExpandContainer: string;
    selectInner: string;
    sizeLarge: string;
    sizeMedium: string;
    sizeMediumLarge: string;
    themeAlt: string;
    themeDefault: string;
    themeGrey: string;
    themeGrid: string;
    widthContent: string;
    widthFluid: string;
    widthStrict: string;
  }
}

declare const SelectCssModule: SelectCssNamespace.ISelectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SelectCssNamespace.ISelectCss;
};

export = SelectCssModule;
