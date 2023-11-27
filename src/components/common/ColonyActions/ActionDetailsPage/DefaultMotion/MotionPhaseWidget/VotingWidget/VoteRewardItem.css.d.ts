declare namespace VoteRewardItemCssNamespace {
  export interface IVoteRewardItemCss {
    range: string;
    tokenIcon: string;
  }
}

declare const VoteRewardItemCssModule: VoteRewardItemCssNamespace.IVoteRewardItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VoteRewardItemCssNamespace.IVoteRewardItemCss;
};

export = VoteRewardItemCssModule;
