declare namespace TableHeaderCssNamespace {
  export interface ITableHeaderCss {
    main: string;
    th: string;
  }
}

declare const TableHeaderCssModule: TableHeaderCssNamespace.ITableHeaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TableHeaderCssNamespace.ITableHeaderCss;
};

export = TableHeaderCssModule;
