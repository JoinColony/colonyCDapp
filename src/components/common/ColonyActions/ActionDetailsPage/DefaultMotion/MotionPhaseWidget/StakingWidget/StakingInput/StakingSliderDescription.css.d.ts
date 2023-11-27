declare namespace StakingSliderDescriptionCssNamespace {
  export interface IStakingSliderDescriptionCss {
    description: string;
    title: string;
  }
}

declare const StakingSliderDescriptionCssModule: StakingSliderDescriptionCssNamespace.IStakingSliderDescriptionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StakingSliderDescriptionCssNamespace.IStakingSliderDescriptionCss;
};

export = StakingSliderDescriptionCssModule;
