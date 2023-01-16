declare namespace ColonyDecisionsCssNamespace {
  export interface IColonyDecisionsCss {
    bar: string;
    draftDecisionContainer: string;
    emptyState: string;
    filter: string;
    installExtension: string;
    loadingSpinner: string;
    title: string;
  }
}

declare const ColonyDecisionsCssModule: ColonyDecisionsCssNamespace.IColonyDecisionsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyDecisionsCssNamespace.IColonyDecisionsCss;
};

export = ColonyDecisionsCssModule;
