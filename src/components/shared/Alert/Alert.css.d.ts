declare namespace AlertCssNamespace {
  export interface IAlertCss {
    borderRadiusLarge: string;
    borderRadiusMedium: string;
    borderRadiusNone: string;
    borderRadiusRound: string;
    borderRadiusSmall: string;
    closeButton: string;
    main: string;
    marginDefault: string;
    marginNone: string;
    newInfoBlue: string;
    sizeSmall: string;
    themeDanger: string;
    themeInfo: string;
    themePinky: string;
    themePrimary: string;
  }
}

declare const AlertCssModule: AlertCssNamespace.IAlertCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AlertCssNamespace.IAlertCss;
};

export = AlertCssModule;
