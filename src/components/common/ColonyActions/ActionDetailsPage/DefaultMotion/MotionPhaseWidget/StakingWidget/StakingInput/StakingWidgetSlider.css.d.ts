declare namespace StakingWidgetSliderCssNamespace {
  export interface IStakingWidgetSliderCss {
    sliderContainer: string;
  }
}

declare const StakingWidgetSliderCssModule: StakingWidgetSliderCssNamespace.IStakingWidgetSliderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StakingWidgetSliderCssNamespace.IStakingWidgetSliderCss;
};

export = StakingWidgetSliderCssModule;
