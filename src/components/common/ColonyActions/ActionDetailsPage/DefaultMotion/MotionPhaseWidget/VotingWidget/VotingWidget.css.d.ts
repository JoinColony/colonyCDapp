declare namespace VotingWidgetCssNamespace {
  export interface IVotingWidgetCss {
    main: string;
    voteHiddenContainer: string;
  }
}

declare const VotingWidgetCssModule: VotingWidgetCssNamespace.IVotingWidgetCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VotingWidgetCssNamespace.IVotingWidgetCss;
};

export = VotingWidgetCssModule;
