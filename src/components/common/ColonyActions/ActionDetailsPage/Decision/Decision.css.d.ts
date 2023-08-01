declare namespace DecisionCssNamespace {
  export interface IDecisionCss {
    description: string;
    header: string;
    main: string;
    nameAndTime: string;
    time: string;
    title: string;
    userName: string;
  }
}

declare const DecisionCssModule: DecisionCssNamespace.IDecisionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DecisionCssNamespace.IDecisionCss;
};

export = DecisionCssModule;
