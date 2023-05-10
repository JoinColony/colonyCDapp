declare namespace MembersListItemCssNamespace {
  export interface IMembersListItemCss {
    main: string;
    mappings: string;
    names: string;
    query428: string;
    reputationSection: string;
    section: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    stateHasReputation: string;
    stateReputationLoaded: string;
    version: string;
  }
}

declare const MembersListItemCssModule: MembersListItemCssNamespace.IMembersListItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MembersListItemCssNamespace.IMembersListItemCss;
};

export = MembersListItemCssModule;
