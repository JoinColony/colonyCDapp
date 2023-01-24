declare namespace EditDomainDialogFormCssNamespace {
  export interface IEditDomainDialogFormCss {
    domainName: string;
    headingContainer: string;
    mappings: string;
    modalHeading: string;
    motionVoteDomain: string;
    nameAndColorContainer: string;
    names: string;
    noPermissionFromMessage: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
    wideButton: string;
  }
}

declare const EditDomainDialogFormCssModule: EditDomainDialogFormCssNamespace.IEditDomainDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: EditDomainDialogFormCssNamespace.IEditDomainDialogFormCss;
};

export = EditDomainDialogFormCssModule;
