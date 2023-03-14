declare namespace PermissionManagementDialogCssNamespace {
  export interface IPermissionManagementDialogCss {
    domainSelectContainer: string;
    noPermissionFromMessage: string;
    permissionChoiceContainer: string;
    singleUserContainer: string;
  }
}

declare const PermissionManagementDialogCssModule: PermissionManagementDialogCssNamespace.IPermissionManagementDialogCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PermissionManagementDialogCssNamespace.IPermissionManagementDialogCss;
};

export = PermissionManagementDialogCssModule;
