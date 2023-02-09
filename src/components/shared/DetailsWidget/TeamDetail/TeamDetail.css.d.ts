declare namespace TeamDetailCssNamespace {
  export interface ITeamDetailCss {
    text: string;
  }
}

declare const TeamDetailCssModule: TeamDetailCssNamespace.ITeamDetailCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TeamDetailCssNamespace.ITeamDetailCss;
};

export = TeamDetailCssModule;
