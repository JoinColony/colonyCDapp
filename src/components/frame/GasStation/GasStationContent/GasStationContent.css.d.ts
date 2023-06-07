declare namespace GasStationContentCssNamespace {
  export interface IGasStationContentCss {
    main: string;
    mappings: string;
    names: string;
    query850: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    stateIsEmpty: string;
    transactionsContainer: string;
    version: string;
  }
}

declare const GasStationContentCssModule: GasStationContentCssNamespace.IGasStationContentCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GasStationContentCssNamespace.IGasStationContentCss;
};

export = GasStationContentCssModule;
