declare namespace UserReputationModuleCssNamespace {
  export interface IUserReputationModuleCss {
    popover: string;
  }
}

declare const UserReputationModuleCssModule: UserReputationModuleCssNamespace.IUserReputationModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserReputationModuleCssNamespace.IUserReputationModuleCss;
};

export = UserReputationModuleCssModule;
