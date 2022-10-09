declare namespace NumeralCssNamespace {
  export interface INumeralCss {
    main: string;
    numeral: string;
    sizeLarge: string;
    sizeMedium: string;
    sizeSmall: string;
    sizeSmallish: string;
    themeBlue: string;
    themeDark: string;
    themeGrey: string;
    themePrimary: string;
    weightMedium: string;
  }
}

declare const NumeralCssModule: NumeralCssNamespace.INumeralCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NumeralCssNamespace.INumeralCss;
};

export = NumeralCssModule;
