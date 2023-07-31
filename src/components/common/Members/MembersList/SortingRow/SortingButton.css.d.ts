declare namespace SortingButtonCssNamespace {
  export interface ISortingButtonCss {
    sortingButton: string;
    sortingIcon: string;
    toggledIcon: string;
  }
}

declare const SortingButtonCssModule: SortingButtonCssNamespace.ISortingButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SortingButtonCssNamespace.ISortingButtonCss;
};

export = SortingButtonCssModule;
