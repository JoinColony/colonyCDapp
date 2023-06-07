declare namespace UserAvatarModuleCssNamespace {
  export interface IUserAvatarModuleCss {
    main: string;
  }
}

declare const UserAvatarModuleCssModule: UserAvatarModuleCssNamespace.IUserAvatarModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserAvatarModuleCssNamespace.IUserAvatarModuleCss;
};

export = UserAvatarModuleCssModule;
