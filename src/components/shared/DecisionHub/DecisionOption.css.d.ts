declare namespace DecisionOptionCssNamespace {
  export interface IDecisionOptionCss {
    main: string;
    mappings: string;
    names: string;
    query850: string;
    rowContent: string;
    rowIcon: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    stateDisabled: string;
    themeAlt: string;
    tooltip: string;
    version: string;
    wrapper: string;
  }
}

declare const DecisionOptionCssModule: DecisionOptionCssNamespace.IDecisionOptionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DecisionOptionCssNamespace.IDecisionOptionCss;
};

export = DecisionOptionCssModule;
