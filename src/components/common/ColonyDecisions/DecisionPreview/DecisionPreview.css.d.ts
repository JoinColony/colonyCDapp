declare namespace DecisionPreviewCssNamespace {
  export interface IDecisionPreviewCss {
    banner: string;
    loadingWrapper: string;
    main: string;
    rightContent: string;
  }
}

declare const DecisionPreviewCssModule: DecisionPreviewCssNamespace.IDecisionPreviewCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DecisionPreviewCssNamespace.IDecisionPreviewCss;
};

export = DecisionPreviewCssModule;
