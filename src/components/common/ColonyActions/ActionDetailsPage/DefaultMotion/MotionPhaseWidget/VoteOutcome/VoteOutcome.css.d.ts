declare namespace VoteOutcomeCssNamespace {
  export interface IVoteOutcomeCss {
    main: string;
    outcome: string;
  }
}

declare const VoteOutcomeCssModule: VoteOutcomeCssNamespace.IVoteOutcomeCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VoteOutcomeCssNamespace.IVoteOutcomeCss;
};

export = VoteOutcomeCssModule;
