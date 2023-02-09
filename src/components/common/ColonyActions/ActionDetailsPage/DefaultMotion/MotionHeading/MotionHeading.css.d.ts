declare namespace MotionHeadingCssNamespace {
  export interface IMotionHeadingCss {
    main: string;
  }
}

declare const MotionHeadingCssModule: MotionHeadingCssNamespace.IMotionHeadingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MotionHeadingCssNamespace.IMotionHeadingCss;
};

export = MotionHeadingCssModule;
