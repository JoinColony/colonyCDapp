declare namespace ColonyTotalFundsCssNamespace {
  export interface IColonyTotalFundsCss {
    main: string;
    mappings: string;
    names: string;
    query850: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    totalBalanceCopy: string;
    version: string;
  }
}

declare const ColonyTotalFundsCssModule: ColonyTotalFundsCssNamespace.IColonyTotalFundsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyTotalFundsCssNamespace.IColonyTotalFundsCss;
};

export = ColonyTotalFundsCssModule;
