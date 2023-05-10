declare namespace ColonyMembersCssNamespace {
  export interface IColonyMembersCss {
    loadingWrapper: string;
    main: string;
    mainContent: string;
    mainContentGrid: string;
    mappings: string;
    names: string;
    query428: string;
    rightAside: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const ColonyMembersCssModule: ColonyMembersCssNamespace.IColonyMembersCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyMembersCssNamespace.IColonyMembersCss;
};

export = ColonyMembersCssModule;
