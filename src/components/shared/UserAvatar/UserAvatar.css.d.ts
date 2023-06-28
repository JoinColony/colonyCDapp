declare namespace UserAvatarCssNamespace {
  export interface IUserAvatarCss {
    main: string;
    stateShowOnClick: string;
  }
}

declare const UserAvatarCssModule: UserAvatarCssNamespace.IUserAvatarCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserAvatarCssNamespace.IUserAvatarCss;
};

export = UserAvatarCssModule;
