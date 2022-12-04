declare namespace MembersListItemCssNamespace {
  export interface IMembersListItemCss {
    address: string;
    displayName: string;
    main: string;
    mappings: string;
    names: string;
    query700: string;
    reputationSection: string;
    section: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    stateHasReputation: string;
    stateReputationLoaded: string;
    username: string;
    usernameSection: string;
    version: string;
    whitelistedIcon: string;
    whitelistedIconTooltip: string;
  }
}

declare const MembersListItemCssModule: MembersListItemCssNamespace.IMembersListItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MembersListItemCssNamespace.IMembersListItemCss;
};

export = MembersListItemCssModule;
