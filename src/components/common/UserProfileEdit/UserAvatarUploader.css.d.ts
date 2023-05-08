declare namespace UserAvatarUploaderCssNamespace {
  export interface IUserAvatarUploaderCss {
    main: string;
    mappings: string;
    names: string;
    query428: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const UserAvatarUploaderCssModule: UserAvatarUploaderCssNamespace.IUserAvatarUploaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserAvatarUploaderCssNamespace.IUserAvatarUploaderCss;
};

export = UserAvatarUploaderCssModule;
