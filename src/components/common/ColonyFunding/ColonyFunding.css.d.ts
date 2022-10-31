declare namespace ColonyFundingCssNamespace {
  export interface IColonyFundingCss {
    aside: string;
    banner: string;
    content: string;
    loadingWrapper: string;
    main: string;
    titleContainer: string;
  }
}

declare const ColonyFundingCssModule: ColonyFundingCssNamespace.IColonyFundingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyFundingCssNamespace.IColonyFundingCss;
};

export = ColonyFundingCssModule;
