declare namespace ManageWhitelistDialogFormCssNamespace {
  export interface IManageWhitelistDialogFormCss {
    tabsList: string;
    tabsListContainer: string;
    toggleContainer: string;
    warningContainer: string;
    warningLabel: string;
    warningText: string;
  }
}

declare const ManageWhitelistDialogFormCssModule: ManageWhitelistDialogFormCssNamespace.IManageWhitelistDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ManageWhitelistDialogFormCssNamespace.IManageWhitelistDialogFormCss;
};

export = ManageWhitelistDialogFormCssModule;
