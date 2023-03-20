declare namespace ProgressBarCssNamespace {
  export interface IProgressBarCss {
    backgroundThemeDark: string;
    backgroundThemeDefault: string;
    backgroundThemeTransparent: string;
    barThemeDanger: string;
    barThemePrimary: string;
    borderRadiusSmall: string;
    main: string;
    sizeNormal: string;
    sizeSmall: string;
    threshold: string;
    thresholdPercentage: string;
    thresholdSeparator: string;
    thresholdVisibility: string;
    wrapper: string;
  }
}

declare const ProgressBarCssModule: ProgressBarCssNamespace.IProgressBarCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ProgressBarCssNamespace.IProgressBarCss;
};

export = ProgressBarCssModule;
