declare namespace DefaultCssNamespace {
  export interface IDefaultCss {
    children: string;
    coloniesList: string;
    content: string;
    head: string;
    history: string;
    main: string;
    mappings: string;
    names: string;
    onlyHistory: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const DefaultCssModule: DefaultCssNamespace.IDefaultCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DefaultCssNamespace.IDefaultCss;
};

export = DefaultCssModule;
