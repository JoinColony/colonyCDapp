declare namespace PermissionManagementDialogFormCssNamespace {
  export interface IPermissionManagementDialogFormCss {
    domainSelectContainer: string;
    noPermissionFromMessage: string;
    permissionChoiceContainer: string;
    singleUserContainer: string;
  }
}

declare const PermissionManagementDialogFormCssModule: PermissionManagementDialogFormCssNamespace.IPermissionManagementDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PermissionManagementDialogFormCssNamespace.IPermissionManagementDialogFormCss;
};

export = PermissionManagementDialogFormCssModule;
