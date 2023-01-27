declare namespace DecisionPreviewControlsCssNamespace {
  export interface IDecisionPreviewControlsCss {
    buttonContainer: string;
  }
}

declare const DecisionPreviewControlsCssModule: DecisionPreviewControlsCssNamespace.IDecisionPreviewControlsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DecisionPreviewControlsCssNamespace.IDecisionPreviewControlsCss;
};

export = DecisionPreviewControlsCssModule;
