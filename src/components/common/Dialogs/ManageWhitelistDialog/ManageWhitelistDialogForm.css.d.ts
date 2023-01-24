declare namespace ManageWhitelistDialogFormCssNamespace {
  export interface IManageWhitelistDialogFormCss {
    noPermissionMessage: string;
    tabsList: string;
    tabsListContainer: string;
    toggleContainer: string;
    tooltip: string;
    warningContainer: string;
    warningLabel: string;
    warningText: string;
    wideButton: string;
  }
}

declare const ManageWhitelistDialogFormCssModule: ManageWhitelistDialogFormCssNamespace.IManageWhitelistDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ManageWhitelistDialogFormCssNamespace.IManageWhitelistDialogFormCss;
};

export = ManageWhitelistDialogFormCssModule;
