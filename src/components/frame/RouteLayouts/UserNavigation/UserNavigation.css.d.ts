declare namespace UserNavigationCssNamespace {
  export interface IUserNavigationCss {
    elementWrapper: string;
    main: string;
    mappings: string;
    names: string;
    query850: string;
    reputation: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
    walletWrapper: string;
  }
}

declare const UserNavigationCssModule: UserNavigationCssNamespace.IUserNavigationCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserNavigationCssNamespace.IUserNavigationCss;
};

export = UserNavigationCssModule;
