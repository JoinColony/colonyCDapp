declare namespace TableCssNamespace {
  export interface ITableCss {
    baseStyles: string;
    main: string;
    separatorsBorders: string;
    separatorsRows: string;
    stateScrollable: string;
    tableRadii: string;
    themeDark: string;
    themeLined: string;
    themeRounder: string;
  }
}

declare const TableCssModule: TableCssNamespace.ITableCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TableCssNamespace.ITableCss;
};

export = TableCssModule;
