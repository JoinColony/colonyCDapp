declare namespace DecisionContentCssNamespace {
  export interface IDecisionContentCss {
    decisionContent: string;
    descriptionContainer: string;
    noContent: string;
    userName: string;
    userinfo: string;
  }
}

declare const DecisionContentCssModule: DecisionContentCssNamespace.IDecisionContentCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DecisionContentCssNamespace.IDecisionContentCss;
};

export = DecisionContentCssModule;
