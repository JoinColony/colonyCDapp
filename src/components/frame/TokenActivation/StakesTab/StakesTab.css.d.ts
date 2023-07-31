declare namespace StakesTabCssNamespace {
  export interface IStakesTabCss {
    claimAllButtonSection: string;
    falseLink: string;
    loader: string;
    noClaims: string;
    stakesContainer: string;
    stakesContent: string;
    stakesListItem: string;
  }
}

declare const StakesTabCssModule: StakesTabCssNamespace.IStakesTabCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StakesTabCssNamespace.IStakesTabCss;
};

export = StakesTabCssModule;
