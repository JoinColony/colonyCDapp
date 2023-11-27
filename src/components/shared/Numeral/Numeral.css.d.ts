declare namespace NumeralCssNamespace {
  export interface INumeralCss {
    main: string;
    sizeSmall: string;
    themeDark: string;
  }
}

declare const NumeralCssModule: NumeralCssNamespace.INumeralCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NumeralCssNamespace.INumeralCss;
};

export = NumeralCssModule;
