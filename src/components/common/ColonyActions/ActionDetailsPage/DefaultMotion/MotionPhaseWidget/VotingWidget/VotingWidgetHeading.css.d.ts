declare namespace VotingWidgetHeadingCssNamespace {
  export interface IVotingWidgetHeadingCss {
    main: string;
  }
}

declare const VotingWidgetHeadingCssModule: VotingWidgetHeadingCssNamespace.IVotingWidgetHeadingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VotingWidgetHeadingCssNamespace.IVotingWidgetHeadingCss;
};

export = VotingWidgetHeadingCssModule;
