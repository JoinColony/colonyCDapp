declare namespace QueriesCssNamespace {
  export interface IQueriesCss {
    query400: string;
    query700: string;
  }
}

declare const QueriesCssModule: QueriesCssNamespace.IQueriesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: QueriesCssNamespace.IQueriesCss;
};

export = QueriesCssModule;
