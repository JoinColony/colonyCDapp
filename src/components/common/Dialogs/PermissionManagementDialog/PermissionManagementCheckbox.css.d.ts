declare namespace PermissionManagementCheckboxCssNamespace {
  export interface IPermissionManagementCheckboxCss {
    permissionChoice: string;
    permissionChoiceDescription: string;
  }
}

declare const PermissionManagementCheckboxCssModule: PermissionManagementCheckboxCssNamespace.IPermissionManagementCheckboxCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PermissionManagementCheckboxCssNamespace.IPermissionManagementCheckboxCss;
};

export = PermissionManagementCheckboxCssModule;
