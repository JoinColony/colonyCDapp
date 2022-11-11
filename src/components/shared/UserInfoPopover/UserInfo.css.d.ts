declare namespace UserInfoCssNamespace {
  export interface IUserInfoCss {
    address: string;
    container: string;
    textContainer: string;
    userName: string;
  }
}

declare const UserInfoCssModule: UserInfoCssNamespace.IUserInfoCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserInfoCssNamespace.IUserInfoCss;
};

export = UserInfoCssModule;
