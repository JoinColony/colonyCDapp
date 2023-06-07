declare namespace MotionHeadingCssNamespace {
  export interface IMotionHeadingCss {
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

declare const MotionHeadingCssModule: MotionHeadingCssNamespace.IMotionHeadingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MotionHeadingCssNamespace.IMotionHeadingCss;
};

export = MotionHeadingCssModule;
