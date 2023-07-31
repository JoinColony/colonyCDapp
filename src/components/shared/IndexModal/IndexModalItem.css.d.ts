declare namespace IndexModalItemCssNamespace {
  export interface IIndexModalItemCss {
    coming: string;
    description: string;
    iconCaret: string;
    iconTitle: string;
    iconWarning: string;
    main: string;
    stateDisabled: string;
    title: string;
    tooltip: string;
  }
}

declare const IndexModalItemCssModule: IndexModalItemCssNamespace.IIndexModalItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModalItemCssNamespace.IIndexModalItemCss;
};

export = IndexModalItemCssModule;
