declare namespace EmptyContentModuleCssNamespace {
  export interface IEmptyContentModuleCss {
    emptyContent: string;
  }
}

declare const EmptyContentModuleCssModule: EmptyContentModuleCssNamespace.IEmptyContentModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: EmptyContentModuleCssNamespace.IEmptyContentModuleCss;
};

export = EmptyContentModuleCssModule;
