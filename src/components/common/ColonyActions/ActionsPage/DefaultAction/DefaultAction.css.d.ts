declare namespace DefaultActionCssNamespace {
  export interface IDefaultActionCss {
    container: string;
    content: string;
    details: string;
    dividerTop: string;
    heading: string;
    main: string;
    mappings: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    tagWrapper: string;
    upperContainer: string;
    version: string;
  }
}

declare const DefaultActionCssModule: DefaultActionCssNamespace.IDefaultActionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DefaultActionCssNamespace.IDefaultActionCss;
};

export = DefaultActionCssModule;
