declare namespace ColonyMembersWidgetCssNamespace {
  export interface IColonyMembersWidgetCss {
    heading: string;
    loadingText: string;
    main: string;
    remaningAvatars: string;
    tooltip: string;
    userAvatar: string;
    userAvatars: string;
    userBanned: string;
  }
}

declare const ColonyMembersWidgetCssModule: ColonyMembersWidgetCssNamespace.IColonyMembersWidgetCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyMembersWidgetCssNamespace.IColonyMembersWidgetCss;
};

export = ColonyMembersWidgetCssModule;
