declare namespace LegacyPermissionWarningCssNamespace {
  export interface ILegacyPermissionWarningCss {
    highlightInstruction: string;
    permissionsWarning: string;
    warningDescription: string;
    warningTitle: string;
  }
}

declare const LegacyPermissionWarningCssModule: LegacyPermissionWarningCssNamespace.ILegacyPermissionWarningCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LegacyPermissionWarningCssNamespace.ILegacyPermissionWarningCss;
};

export = LegacyPermissionWarningCssModule;
