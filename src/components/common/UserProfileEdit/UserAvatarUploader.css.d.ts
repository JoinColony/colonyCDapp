declare namespace UserAvatarUploaderCssNamespace {
  export interface IUserAvatarUploaderCss {
    inputStatus: string;
  }
}

declare const UserAvatarUploaderCssModule: UserAvatarUploaderCssNamespace.IUserAvatarUploaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserAvatarUploaderCssNamespace.IUserAvatarUploaderCss;
};

export = UserAvatarUploaderCssModule;
