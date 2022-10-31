declare namespace ColonyMembersCssNamespace {
  export interface IColonyMembersCss {
    controls: string;
    loadingWrapper: string;
    main: string;
    mainContent: string;
    mainContentGrid: string;
    rightAside: string;
  }
}

declare const ColonyMembersCssModule: ColonyMembersCssNamespace.IColonyMembersCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyMembersCssNamespace.IColonyMembersCss;
};

export = ColonyMembersCssModule;
