declare namespace DecisionControlsCssNamespace {
  export interface IDecisionControlsCss {
    main: string;
  }
}

declare const DecisionControlsCssModule: DecisionControlsCssNamespace.IDecisionControlsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DecisionControlsCssNamespace.IDecisionControlsCss;
};

export = DecisionControlsCssModule;
