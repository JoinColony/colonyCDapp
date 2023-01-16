declare namespace DecisionDialogCssNamespace {
  export interface IDecisionDialogCss {
    main: string;
  }
}

declare const DecisionDialogCssModule: DecisionDialogCssNamespace.IDecisionDialogCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DecisionDialogCssNamespace.IDecisionDialogCss;
};

export = DecisionDialogCssModule;
