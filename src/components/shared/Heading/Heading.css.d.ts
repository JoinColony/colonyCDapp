declare namespace HeadingCssNamespace {
  export interface IHeadingCss {
    main: string;
    marginDouble: string;
    marginNone: string;
    marginSmall: string;
    sizeHuge: string;
    sizeLarge: string;
    sizeMedium: string;
    sizeNormal: string;
    sizeSmall: string;
    sizeTiny: string;
    themeDark: string;
    themeGrey: string;
    themeInvert: string;
    themePrimary: string;
    themeUppercase: string;
    weightBold: string;
    weightMedium: string;
    weightThin: string;
  }
}

declare const HeadingCssModule: HeadingCssNamespace.IHeadingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HeadingCssNamespace.IHeadingCss;
};

export = HeadingCssModule;
