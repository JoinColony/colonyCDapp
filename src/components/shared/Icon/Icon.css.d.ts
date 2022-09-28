declare namespace IconCssNamespace {
  export interface IIconCss {
    main: string;
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

declare const IconCssModule: IconCssNamespace.IIconCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IconCssNamespace.IIconCss;
};

export = IconCssModule;
