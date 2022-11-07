declare namespace ColonyFundingWidgetCssNamespace {
  export interface IColonyFundingWidgetCss {
    main: string;
    tokenBalance: string;
    tokenItem: string;
    tokenLockWrapper: string;
    tokenSymbol: string;
    tokenValue: string;
  }
}

declare const ColonyFundingWidgetCssModule: ColonyFundingWidgetCssNamespace.IColonyFundingWidgetCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyFundingWidgetCssNamespace.IColonyFundingWidgetCss;
};

export = ColonyFundingWidgetCssModule;
