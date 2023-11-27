declare namespace StakeRequiredBannerCssNamespace {
  export interface IStakeRequiredBannerCss {
    bannerHeight: string;
    bannerText: string;
    stakeRequiredBanner: string;
  }
}

declare const StakeRequiredBannerCssModule: StakeRequiredBannerCssNamespace.IStakeRequiredBannerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StakeRequiredBannerCssNamespace.IStakeRequiredBannerCss;
};

export = StakeRequiredBannerCssModule;
