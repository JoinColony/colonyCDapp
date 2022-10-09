declare namespace SpinnerLoaderCssNamespace {
  export interface ISpinnerLoaderCss {
    layoutHorizontal: string;
    loader: string;
    loadingTextContainer: string;
    main: string;
    sizeHuge: string;
    sizeLarge: string;
    sizeMassive: string;
    sizeMedium: string;
    sizeSmall: string;
    spinAround: string;
    themeGrey: string;
    themePrimary: string;
  }
}

declare const SpinnerLoaderCssModule: SpinnerLoaderCssNamespace.ISpinnerLoaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SpinnerLoaderCssNamespace.ISpinnerLoaderCss;
};

export = SpinnerLoaderCssModule;
