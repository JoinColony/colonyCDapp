declare namespace PermissionsLabelCssNamespace {
  export interface IPermissionsLabelCss {
    icon: string;
    label: string;
    main: string;
    stateNoPointer: string;
    themeDefault: string;
    themeSimple: string;
    themeWhite: string;
    tooltip: string;
  }
}

declare const PermissionsLabelCssModule: PermissionsLabelCssNamespace.IPermissionsLabelCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PermissionsLabelCssNamespace.IPermissionsLabelCss;
};

export = PermissionsLabelCssModule;
