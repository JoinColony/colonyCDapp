declare namespace ColonyAddressCssNamespace {
  export interface IColonyAddressCss {
    colonyAddress: string;
    mappings: string;
    names: string;
    query850: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const ColonyAddressCssModule: ColonyAddressCssNamespace.IColonyAddressCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyAddressCssNamespace.IColonyAddressCss;
};

export = ColonyAddressCssModule;
