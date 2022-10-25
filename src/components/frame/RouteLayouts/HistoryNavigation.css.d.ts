declare namespace HistoryNavigationCssNamespace {
  export interface IHistoryNavigationCss {
    back: string;
    main: string;
  }
}

declare const HistoryNavigationCssModule: HistoryNavigationCssNamespace.IHistoryNavigationCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HistoryNavigationCssNamespace.IHistoryNavigationCss;
};

export = HistoryNavigationCssModule;
