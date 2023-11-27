declare namespace ManageReputationDialogFormCssNamespace {
  export interface IManageReputationDialogFormCss {
    activeItem: string;
    divider: string;
    domainSelects: string;
    motionVoteDomain: string;
    singleUserContainer: string;
    warningContainer: string;
    warningText: string;
    warningTitle: string;
  }
}

declare const ManageReputationDialogFormCssModule: ManageReputationDialogFormCssNamespace.IManageReputationDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ManageReputationDialogFormCssNamespace.IManageReputationDialogFormCss;
};

export = ManageReputationDialogFormCssModule;
