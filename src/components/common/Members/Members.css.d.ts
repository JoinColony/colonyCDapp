declare namespace MembersCssNamespace {
  export interface IMembersCss {
    communityRole: string;
    main: string;
    mappings: string;
    membersContainer: string;
    names: string;
    noResults: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    subscribeButton: string;
    subscribeCallToAction: string;
    subscribedIcon: string;
    tableBody: string;
    titleContainer: string;
    unsubscribedIcon: string;
    version: string;
  }
}

declare const MembersCssModule: MembersCssNamespace.IMembersCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MembersCssNamespace.IMembersCss;
};

export = MembersCssModule;
