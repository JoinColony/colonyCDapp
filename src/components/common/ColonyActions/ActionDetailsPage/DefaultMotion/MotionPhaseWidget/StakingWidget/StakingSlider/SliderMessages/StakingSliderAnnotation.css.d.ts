declare namespace StakingSliderAnnotationCssNamespace {
  export interface IStakingSliderAnnotationCss {
    minStakeAmountContainer: string;
    tooltip: string;
  }
}

declare const StakingSliderAnnotationCssModule: StakingSliderAnnotationCssNamespace.IStakingSliderAnnotationCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StakingSliderAnnotationCssNamespace.IStakingSliderAnnotationCss;
};

export = StakingSliderAnnotationCssModule;
