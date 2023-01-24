declare namespace ManageReputationDialogFormCssNamespace {
  export interface IManageReputationDialogFormCss {
    activeItem: string;
    divider: string;
    domainSelects: string;
    headingContainer: string;
    inputContainer: string;
    inputText: string;
    mappings: string;
    modalHeading: string;
    motionVoteDomain: string;
    names: string;
    noPermissionFromMessage: string;
    percentageSign: string;
    query700: string;
    singleUserContainer: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
    warningContainer: string;
    warningText: string;
    warningTitle: string;
    wideButton: string;
  }
}

declare const ManageReputationDialogFormCssModule: ManageReputationDialogFormCssNamespace.IManageReputationDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ManageReputationDialogFormCssNamespace.IManageReputationDialogFormCss;
};

export = ManageReputationDialogFormCssModule;
