declare namespace DefaultActionContentCssNamespace {
  export interface IDefaultActionContentCss {
    annotations: string;
    content: string;
    heading: string;
    mappings: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    time: string;
    version: string;
  }
}

declare const DefaultActionContentCssModule: DefaultActionContentCssNamespace.IDefaultActionContentCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DefaultActionContentCssNamespace.IDefaultActionContentCss;
};

export = DefaultActionContentCssModule;
