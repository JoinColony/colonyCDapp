declare namespace GasStationHeaderCssNamespace {
  export interface IGasStationHeaderCss {
    actionsContainer: string;
    closeButton: string;
    connectedNetwork: string;
    goToWalletIcon: string;
    main: string;
    mappings: string;
    names: string;
    query428: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
    walletAddress: string;
    walletDetails: string;
    walletHeading: string;
  }
}

declare const GasStationHeaderCssModule: GasStationHeaderCssNamespace.IGasStationHeaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GasStationHeaderCssNamespace.IGasStationHeaderCss;
};

export = GasStationHeaderCssModule;
