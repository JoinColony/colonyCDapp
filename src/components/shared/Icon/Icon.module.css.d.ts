declare namespace IconModuleCssNamespace {
  export interface IIconModuleCss {
    main: string;
    sizeBig: string;
    sizeExtraBig: string;
    sizeExtraExtraTiny: string;
    sizeExtraSmall: string;
    sizeExtraTiny: string;
    sizeHuge: string;
    sizeLarge: string;
    sizeLargeSmall: string;
    sizeMedium: string;
    sizeMediumSmall: string;
    sizeMediumSmallMediumLargeSmallTinyBigMediumLargeSmall: string;
    sizeNormal: string;
    sizeSmall: string;
    sizeTiny: string;
    themeInvert: string;
    themePrimary: string;
  }
}

declare const IconModuleCssModule: IconModuleCssNamespace.IIconModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IconModuleCssNamespace.IIconModuleCss;
};

export = IconModuleCssModule;
