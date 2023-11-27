declare namespace VoteDetailsCssNamespace {
  export interface IVoteDetailsCss {
    main: string;
  }
}

declare const VoteDetailsCssModule: VoteDetailsCssNamespace.IVoteDetailsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VoteDetailsCssNamespace.IVoteDetailsCss;
};

export = VoteDetailsCssModule;
