declare namespace UserMetaCssNamespace {
  export interface IUserMetaCss {
    avatar: string;
    bioContainer: string;
    contentMargin: string;
    headingContainer: string;
    locationContainer: string;
    main: string;
    mappings: string;
    names: string;
    profileLink: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    usernameContainer: string;
    version: string;
    websiteContainer: string;
  }
}

declare const UserMetaCssModule: UserMetaCssNamespace.IUserMetaCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserMetaCssNamespace.IUserMetaCss;
};

export = UserMetaCssModule;
