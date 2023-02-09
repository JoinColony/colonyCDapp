declare namespace DefaultMotionCssNamespace {
  export interface IDefaultMotionCss {
    bannerHeight: string;
    container: string;
    defaultAction: string;
    main: string;
    mappings: string;
    names: string;
    query400: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const DefaultMotionCssModule: DefaultMotionCssNamespace.IDefaultMotionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DefaultMotionCssNamespace.IDefaultMotionCss;
};

export = DefaultMotionCssModule;
