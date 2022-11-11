declare namespace DecisionOptionCssNamespace {
  export interface IDecisionOptionCss {
    main: string;
    rowContent: string;
    rowIcon: string;
    stateDisabled: string;
    themeAlt: string;
    tooltip: string;
    wrapper: string;
  }
}

declare const DecisionOptionCssModule: DecisionOptionCssNamespace.IDecisionOptionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DecisionOptionCssNamespace.IDecisionOptionCss;
};

export = DecisionOptionCssModule;
