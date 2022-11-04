declare namespace MembersListItemCssNamespace {
  export interface IMembersListItemCss {
    address: string;
    displayName: string;
    main: string;
    reputationSection: string;
    section: string;
    stateHasReputation: string;
    stateReputationLoaded: string;
    username: string;
    usernameSection: string;
  }
}

declare const MembersListItemCssModule: MembersListItemCssNamespace.IMembersListItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MembersListItemCssNamespace.IMembersListItemCss;
};

export = MembersListItemCssModule;
