declare namespace UserHubModuleCssNamespace {
  export interface IUserHubModuleCss {
    li: string;
    wrapper: string;
  }
}

declare const UserHubModuleCssModule: UserHubModuleCssNamespace.IUserHubModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserHubModuleCssNamespace.IUserHubModuleCss;
};

export = UserHubModuleCssModule;
