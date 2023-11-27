declare namespace LoadMoreButtonCssNamespace {
  export interface ILoadMoreButtonCss {
    loadMoreButton: string;
  }
}

declare const LoadMoreButtonCssModule: LoadMoreButtonCssNamespace.ILoadMoreButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LoadMoreButtonCssNamespace.ILoadMoreButtonCss;
};

export = LoadMoreButtonCssModule;
