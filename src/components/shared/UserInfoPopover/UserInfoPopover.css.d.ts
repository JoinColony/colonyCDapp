declare namespace UserInfoPopoverCssNamespace {
  export interface IUserInfoPopoverCss {
    bannedTag: string;
    domainName: string;
    domainReputationItem: string;
    icon: string;
    loadingSpinnerContainer: string;
    main: string;
    noReputationDescription: string;
    reputation: string;
    reputationColor: string;
    reputationContainer: string;
    roleList: string;
    section: string;
    sectionContainer: string;
    tokenAmount: string;
  }
}

declare const UserInfoPopoverCssModule: UserInfoPopoverCssNamespace.IUserInfoPopoverCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UserInfoPopoverCssNamespace.IUserInfoPopoverCss;
};

export = UserInfoPopoverCssModule;
