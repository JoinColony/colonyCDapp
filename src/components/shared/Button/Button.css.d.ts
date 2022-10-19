declare namespace ButtonCssNamespace {
  export interface IButtonCss {
    colorSchemaGrey: string;
    colorSchemaInverted: string;
    disabledBackground: string;
    disabledColor: string;
    ghostBorder: string;
    main: string;
    sizeLarge: string;
    sizeMedium: string;
    sizeSmall: string;
    themeBlue: string;
    themeDanger: string;
    themeDangerLink: string;
    themeDottedArea: string;
    themeGhost: string;
    themePink: string;
    themePrimary: string;
    themeSecondary: string;
    themeUnderlinedBold: string;
    themeWhite: string;
  }
}

declare const ButtonCssModule: ButtonCssNamespace.IButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ButtonCssNamespace.IButtonCss;
};

export = ButtonCssModule;
