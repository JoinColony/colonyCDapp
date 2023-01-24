declare namespace TeamDropdownItemCssNamespace {
  export interface ITeamDropdownItemCss {
    color: string;
    headingWrapper: string;
    main: string;
  }
}

declare const TeamDropdownItemCssModule: TeamDropdownItemCssNamespace.ITeamDropdownItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TeamDropdownItemCssNamespace.ITeamDropdownItemCss;
};

export = TeamDropdownItemCssModule;
