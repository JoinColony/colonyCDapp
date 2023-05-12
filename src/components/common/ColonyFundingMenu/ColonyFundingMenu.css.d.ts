declare namespace ColonyFundingMenuCssNamespace {
  export interface IColonyFundingMenuCss {
    main: string;
    mappings: string;
    names: string;
    query850: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const ColonyFundingMenuCssModule: ColonyFundingMenuCssNamespace.IColonyFundingMenuCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyFundingMenuCssNamespace.IColonyFundingMenuCss;
};

export = ColonyFundingMenuCssModule;
