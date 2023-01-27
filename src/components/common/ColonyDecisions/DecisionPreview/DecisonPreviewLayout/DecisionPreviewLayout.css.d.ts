declare namespace DecisionPreviewLayoutCssNamespace {
  export interface IDecisionPreviewLayoutCss {
    layout: string;
    main: string;
  }
}

declare const DecisionPreviewLayoutCssModule: DecisionPreviewLayoutCssNamespace.IDecisionPreviewLayoutCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DecisionPreviewLayoutCssNamespace.IDecisionPreviewLayoutCss;
};

export = DecisionPreviewLayoutCssModule;
