declare namespace SortingRowCssNamespace {
  export interface ISortingRowCss {
    container: string;
    mappings: string;
    names: string;
    query850: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const SortingRowCssModule: SortingRowCssNamespace.ISortingRowCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SortingRowCssNamespace.ISortingRowCss;
};

export = SortingRowCssModule;
