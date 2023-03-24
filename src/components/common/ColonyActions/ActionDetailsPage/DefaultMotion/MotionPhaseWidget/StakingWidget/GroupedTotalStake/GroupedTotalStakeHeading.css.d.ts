declare namespace GroupedTotalStakeHeadingCssNamespace {
  export interface IGroupedTotalStakeHeadingCss {
    help: string;
    title: string;
    tooltip: string;
    widgetHeading: string;
  }
}

declare const GroupedTotalStakeHeadingCssModule: GroupedTotalStakeHeadingCssNamespace.IGroupedTotalStakeHeadingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GroupedTotalStakeHeadingCssNamespace.IGroupedTotalStakeHeadingCss;
};

export = GroupedTotalStakeHeadingCssModule;
