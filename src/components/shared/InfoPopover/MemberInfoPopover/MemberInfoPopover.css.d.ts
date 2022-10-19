declare namespace MemberInfoPopoverCssNamespace {
  export interface IMemberInfoPopoverCss {
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

declare const MemberInfoPopoverCssModule: MemberInfoPopoverCssNamespace.IMemberInfoPopoverCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MemberInfoPopoverCssNamespace.IMemberInfoPopoverCss;
};

export = MemberInfoPopoverCssModule;
