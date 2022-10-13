declare namespace ColonyMembersCssNamespace {
  export interface IColonyMembersCss {
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

declare const ColonyMembersCssModule: ColonyMembersCssNamespace.IColonyMembersCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyMembersCssNamespace.IColonyMembersCss;
};

export = ColonyMembersCssModule;
