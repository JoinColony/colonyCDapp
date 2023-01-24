declare namespace CreateDomainDialogFormCssNamespace {
  export interface ICreateDomainDialogFormCss {
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
    title: string;
    version: string;
    wideButton: string;
  }
}

declare const CreateDomainDialogFormCssModule: CreateDomainDialogFormCssNamespace.ICreateDomainDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreateDomainDialogFormCssNamespace.ICreateDomainDialogFormCss;
};

export = CreateDomainDialogFormCssModule;
