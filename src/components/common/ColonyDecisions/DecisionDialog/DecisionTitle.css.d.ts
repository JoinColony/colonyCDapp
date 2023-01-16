declare namespace DecisionTitleCssNamespace {
  export interface IDecisionTitleCss {
    label: string;
    main: string;
    tooltipContainer: string;
  }
}

declare const DecisionTitleCssModule: DecisionTitleCssNamespace.IDecisionTitleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DecisionTitleCssNamespace.IDecisionTitleCss;
};

export = DecisionTitleCssModule;
