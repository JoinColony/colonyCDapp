declare namespace MiniSpinnerLoaderCssNamespace {
  export interface IMiniSpinnerLoaderCss {
    loadingText: string;
  }
}

declare const MiniSpinnerLoaderCssModule: MiniSpinnerLoaderCssNamespace.IMiniSpinnerLoaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MiniSpinnerLoaderCssNamespace.IMiniSpinnerLoaderCss;
};

export = MiniSpinnerLoaderCssModule;
