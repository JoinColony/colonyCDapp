declare namespace IconButtonCssNamespace {
  export interface IIconButtonCss {
    main: string;
    sizeLarge: string;
    sizeMedium: string;
    sizeSmall: string;
    themeBlue: string;
    themeDanger: string;
    themeGhost: string;
    themePrimary: string;
    themeSecondary: string;
    themeUnderlineBold: string;
  }
}

declare const IconButtonCssModule: IconButtonCssNamespace.IIconButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IconButtonCssNamespace.IIconButtonCss;
};

export = IconButtonCssModule;
