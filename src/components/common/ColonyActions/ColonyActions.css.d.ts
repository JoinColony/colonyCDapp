declare namespace ColonyActionsCssNamespace {
  export interface IColonyActionsCss {
    emptyState: string;
    loadingSpinner: string;
    main: string;
    mappings: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const ColonyActionsCssModule: ColonyActionsCssNamespace.IColonyActionsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyActionsCssNamespace.IColonyActionsCss;
};

export = ColonyActionsCssModule;
