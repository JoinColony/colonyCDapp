declare namespace StakeRequiredBannerCssNamespace {
  export interface IStakeRequiredBannerCss {
    bannerHeight: string;
    share: string;
    stakeRequiredBanner: string;
    stakeRequiredBannerContainer: string;
  }
}

declare const StakeRequiredBannerCssModule: StakeRequiredBannerCssNamespace.IStakeRequiredBannerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StakeRequiredBannerCssNamespace.IStakeRequiredBannerCss;
};

export = StakeRequiredBannerCssModule;
