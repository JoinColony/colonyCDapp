declare namespace SafeTransactionBannerCssNamespace {
  export interface ISafeTransactionBannerCss {
    monitorUrl: string;
    safeTransactionBanner: string;
    safeTransactionBannerContainer: string;
  }
}

declare const SafeTransactionBannerCssModule: SafeTransactionBannerCssNamespace.ISafeTransactionBannerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SafeTransactionBannerCssNamespace.ISafeTransactionBannerCss;
};

export = SafeTransactionBannerCssModule;
