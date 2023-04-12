declare namespace MotionCountdownCssNamespace {
  export interface IMotionCountdownCss {
    countdownContainer: string;
    votingCountdownContainer: string;
  }
}

declare const MotionCountdownCssModule: MotionCountdownCssNamespace.IMotionCountdownCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MotionCountdownCssNamespace.IMotionCountdownCss;
};

export = MotionCountdownCssModule;
