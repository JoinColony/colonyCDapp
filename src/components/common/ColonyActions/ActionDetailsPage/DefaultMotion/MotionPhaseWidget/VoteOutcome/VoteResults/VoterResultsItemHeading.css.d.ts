declare namespace VoterResultsItemHeadingCssNamespace {
  export interface IVoterResultsItemHeadingCss {
    main: string;
    votePercentage: string;
  }
}

declare const VoterResultsItemHeadingCssModule: VoterResultsItemHeadingCssNamespace.IVoterResultsItemHeadingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VoterResultsItemHeadingCssNamespace.IVoterResultsItemHeadingCss;
};

export = VoterResultsItemHeadingCssModule;
