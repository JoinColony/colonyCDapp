declare namespace UserDetailCssNamespace {
  export interface IUserDetailCss {
    address: string;
    main: string;
    textContainer: string;
    username: string;
  }
}

declare const UserDetailCssModule: UserDetailCssNamespace.IUserDetailCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserDetailCssNamespace.IUserDetailCss;
};

export = UserDetailCssModule;
