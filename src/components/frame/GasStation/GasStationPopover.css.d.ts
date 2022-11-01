declare namespace GasStationPopoverCssNamespace {
  export interface IGasStationPopoverCss {
    verticalOffset: string;
  }
}

declare const GasStationPopoverCssModule: GasStationPopoverCssNamespace.IGasStationPopoverCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GasStationPopoverCssNamespace.IGasStationPopoverCss;
};

export = GasStationPopoverCssModule;
