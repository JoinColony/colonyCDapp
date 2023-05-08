declare namespace ColonyFundingBannerCssNamespace {
  export interface IColonyFundingBannerCss {
    address: string;
    main: string;
    mappings: string;
    names: string;
    query428: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const ColonyFundingBannerCssModule: ColonyFundingBannerCssNamespace.IColonyFundingBannerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyFundingBannerCssNamespace.IColonyFundingBannerCss;
};

export = ColonyFundingBannerCssModule;
