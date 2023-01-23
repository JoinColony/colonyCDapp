declare namespace DraftDecisionItemCssNamespace {
  export interface IDraftDecisionItemCss {
    draftDecision: string;
  }
}

declare const DraftDecisionItemCssModule: DraftDecisionItemCssNamespace.IDraftDecisionItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DraftDecisionItemCssNamespace.IDraftDecisionItemCss;
};

export = DraftDecisionItemCssModule;
