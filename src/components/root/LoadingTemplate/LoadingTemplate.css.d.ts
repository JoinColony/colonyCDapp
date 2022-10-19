declare namespace LoadingTemplateCssNamespace {
  export interface ILoadingTemplateCss {
    loaderContainer: string;
    loadingDelayedOrFailed: string;
    loadingDelayedOrFailedDetail: string;
    main: string;
    mainContent: string;
    nakedMole: string;
  }
}

declare const LoadingTemplateCssModule: LoadingTemplateCssNamespace.ILoadingTemplateCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LoadingTemplateCssNamespace.ILoadingTemplateCss;
};

export = LoadingTemplateCssModule;
