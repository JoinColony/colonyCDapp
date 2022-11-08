declare namespace MemberReputationCssNamespace {
  export interface IMemberReputationCss {
    icon: string;
    reputation: string;
    reputationWrapper: string;
  }
}

declare const MemberReputationCssModule: MemberReputationCssNamespace.IMemberReputationCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MemberReputationCssNamespace.IMemberReputationCss;
};

export = MemberReputationCssModule;
