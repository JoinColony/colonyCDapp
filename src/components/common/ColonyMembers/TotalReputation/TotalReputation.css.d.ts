declare namespace TotalReputationCssNamespace {
  export interface ITotalReputationCss {
    reputationPoints: string;
    teamReputationPointsContainer: string;
  }
}

declare const TotalReputationCssModule: TotalReputationCssNamespace.ITotalReputationCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TotalReputationCssNamespace.ITotalReputationCss;
};

export = TotalReputationCssModule;
