declare namespace VotingProgressCssNamespace {
  export interface IVotingProgressCss {
    helpProgressBar: string;
    progressBarContainer: string;
    progressStateContainer: string;
    text: string;
    tooltip: string;
  }
}

declare const VotingProgressCssModule: VotingProgressCssNamespace.IVotingProgressCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VotingProgressCssNamespace.IVotingProgressCss;
};

export = VotingProgressCssModule;
