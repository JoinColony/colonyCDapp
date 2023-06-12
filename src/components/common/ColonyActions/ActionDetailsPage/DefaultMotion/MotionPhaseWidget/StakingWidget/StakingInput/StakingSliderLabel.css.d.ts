declare namespace StakingSliderLabelCssNamespace {
  export interface IStakingSliderLabelCss {
    minStakeAmountContainer: string;
    tooltip: string;
  }
}

declare const StakingSliderLabelCssModule: StakingSliderLabelCssNamespace.IStakingSliderLabelCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StakingSliderLabelCssNamespace.IStakingSliderLabelCss;
};

export = StakingSliderLabelCssModule;
