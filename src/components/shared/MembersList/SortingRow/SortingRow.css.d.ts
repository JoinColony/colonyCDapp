declare namespace SortingRowCssNamespace {
  export interface ISortingRowCss {
    container: string;
    mappings: string;
    names: string;
    query700: string;
    sortingButton: string;
    sortingIcon: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    toggledIcon: string;
    version: string;
  }
}

declare const SortingRowCssModule: SortingRowCssNamespace.ISortingRowCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SortingRowCssNamespace.ISortingRowCss;
};

export = SortingRowCssModule;
