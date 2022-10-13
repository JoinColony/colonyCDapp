declare namespace ColonyFundingCssNamespace {
  export interface IColonyFundingCss {
    main: string;
    tokenBalance: string;
    tokenItem: string;
    tokenLockWrapper: string;
    tokenSymbol: string;
    tokenValue: string;
  }
}

declare const ColonyFundingCssModule: ColonyFundingCssNamespace.IColonyFundingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyFundingCssNamespace.IColonyFundingCss;
};

export = ColonyFundingCssModule;
