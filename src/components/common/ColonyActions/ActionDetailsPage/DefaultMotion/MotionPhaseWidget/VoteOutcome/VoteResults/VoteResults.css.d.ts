declare namespace VoteResultsCssNamespace {
  export interface IVoteResultsCss {
    main: string;
  }
}

declare const VoteResultsCssModule: VoteResultsCssNamespace.IVoteResultsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VoteResultsCssNamespace.IVoteResultsCss;
};

export = VoteResultsCssModule;
