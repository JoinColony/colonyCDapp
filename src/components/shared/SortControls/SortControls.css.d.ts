declare namespace SortControlsCssNamespace {
  export interface ISortControlsCss {
    filter: string;
  }
}

declare const SortControlsCssModule: SortControlsCssNamespace.ISortControlsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SortControlsCssNamespace.ISortControlsCss;
};

export = SortControlsCssModule;
