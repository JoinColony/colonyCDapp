declare namespace DecisionNotFoundCssNamespace {
  export interface IDecisionNotFoundCss {
    governanceLink: string;
  }
}

declare const DecisionNotFoundCssModule: DecisionNotFoundCssNamespace.IDecisionNotFoundCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DecisionNotFoundCssNamespace.IDecisionNotFoundCss;
};

export = DecisionNotFoundCssModule;
