declare namespace VoteButtonCssNamespace {
  export interface IVoteButtonCss {
    main: string;
  }
}

declare const VoteButtonCssModule: VoteButtonCssNamespace.IVoteButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VoteButtonCssNamespace.IVoteButtonCss;
};

export = VoteButtonCssModule;
