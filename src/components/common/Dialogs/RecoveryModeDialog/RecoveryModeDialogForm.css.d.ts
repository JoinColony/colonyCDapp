declare namespace RecoveryModeDialogFormCssNamespace {
  export interface IRecoveryModeDialogFormCss {
    leavingRecoveryMessage: string;
    noPermissionMessage: string;
    permissionLabel: string;
    title: string;
    wideButton: string;
  }
}

declare const RecoveryModeDialogFormCssModule: RecoveryModeDialogFormCssNamespace.IRecoveryModeDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RecoveryModeDialogFormCssNamespace.IRecoveryModeDialogFormCss;
};

export = RecoveryModeDialogFormCssModule;
