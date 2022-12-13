declare namespace UserMetaCssNamespace {
  export interface IUserMetaCss {
    avatar: string;
    bioContainer: string;
    contentMargin: string;
    headingContainer: string;
    locationContainer: string;
    main: string;
    profileLink: string;
    usernameContainer: string;
    websiteContainer: string;
  }
}

declare const UserMetaCssModule: UserMetaCssNamespace.IUserMetaCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserMetaCssNamespace.IUserMetaCss;
};

export = UserMetaCssModule;
