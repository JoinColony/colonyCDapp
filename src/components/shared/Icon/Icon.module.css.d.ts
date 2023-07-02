declare namespace IconModuleCssNamespace {
  export interface IIconModuleCss {
    main: string;
    sizeExtraExtraTiny: string;
    sizeExtraTiny: string;
    sizeHuge: string;
    sizeLarge: string;
    sizeMedium: string;
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
