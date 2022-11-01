declare namespace GasStationControlsCssNamespace {
  export interface IGasStationControlsCss {
    controls: string;
    main: string;
  }
}

declare const GasStationControlsCssModule: GasStationControlsCssNamespace.IGasStationControlsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GasStationControlsCssNamespace.IGasStationControlsCss;
};

export = GasStationControlsCssModule;
