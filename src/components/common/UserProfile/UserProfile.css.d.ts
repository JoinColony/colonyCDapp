declare namespace UserProfileCssNamespace {
  export interface IUserProfileCss {
    sectionContainer: string;
  }
}

declare const UserProfileCssModule: UserProfileCssNamespace.IUserProfileCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserProfileCssNamespace.IUserProfileCss;
};

export = UserProfileCssModule;
