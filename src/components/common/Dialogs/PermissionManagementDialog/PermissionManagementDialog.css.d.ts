declare namespace PermissionManagementDialogCssNamespace {
  export interface IPermissionManagementDialogCss {
    dialogContainer: string;
    dialogFooterSection: string;
    domainSelectContainer: string;
    headingContainer: string;
    modalHeading: string;
    motionVoteDomain: string;
    noPermissionFromMessage: string;
    permissionChoiceContainer: string;
    singleUserContainer: string;
    wideButton: string;
  }
}

declare const PermissionManagementDialogCssModule: PermissionManagementDialogCssNamespace.IPermissionManagementDialogCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PermissionManagementDialogCssNamespace.IPermissionManagementDialogCss;
};

export = PermissionManagementDialogCssModule;
