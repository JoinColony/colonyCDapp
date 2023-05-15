declare namespace MemberInfoCssNamespace {
  export interface IMemberInfoCss {
    address: string;
    displayName: string;
    mappings: string;
    names: string;
    query850: string;
    section: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    username: string;
    usernameSection: string;
    version: string;
    whitelistedIcon: string;
    whitelistedIconTooltip: string;
  }
}

declare const MemberInfoCssModule: MemberInfoCssNamespace.IMemberInfoCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MemberInfoCssNamespace.IMemberInfoCss;
};

export = MemberInfoCssModule;
