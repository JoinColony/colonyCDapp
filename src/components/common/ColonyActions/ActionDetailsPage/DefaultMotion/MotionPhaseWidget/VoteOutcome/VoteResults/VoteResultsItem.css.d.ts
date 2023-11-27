declare namespace VoteResultsItemCssNamespace {
  export interface IVoteResultsItemCss {
    themeApprove: string;
    themeDisapprove: string;
    voteInfoContainer: string;
    votePercentageBar: string;
    voteResults: string;
    wrapper: string;
  }
}

declare const VoteResultsItemCssModule: VoteResultsItemCssNamespace.IVoteResultsItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VoteResultsItemCssNamespace.IVoteResultsItemCss;
};

export = VoteResultsItemCssModule;
