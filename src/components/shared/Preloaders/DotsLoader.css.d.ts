declare namespace DotsLoaderCssNamespace {
  export interface IDotsLoaderCss {
    dot1: string;
    dot2: string;
    dot3: string;
    dotLoader: string;
    dotLoaderDot: string;
    grow: string;
  }
}

declare const DotsLoaderCssModule: DotsLoaderCssNamespace.IDotsLoaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DotsLoaderCssNamespace.IDotsLoaderCss;
};

export = DotsLoaderCssModule;
