declare namespace ColonyHomeActionsCssNamespace {
  export interface IColonyHomeActionsCss {
    tooltipWrapper: string;
  }
}

declare const ColonyHomeActionsCssModule: ColonyHomeActionsCssNamespace.IColonyHomeActionsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyHomeActionsCssNamespace.IColonyHomeActionsCss;
};

export = ColonyHomeActionsCssModule;
