declare namespace ColonyTitleCssNamespace {
  export interface IColonyTitleCss {
    colonyTitle: string;
    main: string;
    mappings: string;
    names: string;
    query428: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
    wrapper: string;
  }
}

declare const ColonyTitleCssModule: ColonyTitleCssNamespace.IColonyTitleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyTitleCssNamespace.IColonyTitleCss;
};

export = ColonyTitleCssModule;
