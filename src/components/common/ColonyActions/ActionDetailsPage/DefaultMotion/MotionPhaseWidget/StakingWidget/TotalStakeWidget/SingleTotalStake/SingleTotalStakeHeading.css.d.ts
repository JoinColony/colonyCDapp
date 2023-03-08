declare namespace SingleTotalStakeHeadingCssNamespace {
  export interface ISingleTotalStakeHeadingCss {
    helpTooltip: string;
    stakeProgress: string;
    subHeading: string;
    title: string;
    tooltip: string;
    widgetHeading: string;
  }
}

declare const SingleTotalStakeHeadingCssModule: SingleTotalStakeHeadingCssNamespace.ISingleTotalStakeHeadingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SingleTotalStakeHeadingCssNamespace.ISingleTotalStakeHeadingCss;
};

export = SingleTotalStakeHeadingCssModule;
