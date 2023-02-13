declare namespace CreateDomainDialogFormCssNamespace {
  export interface ICreateDomainDialogFormCss {
    domainName: string;
    nameAndColorContainer: string;
  }
}

declare const CreateDomainDialogFormCssModule: CreateDomainDialogFormCssNamespace.ICreateDomainDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreateDomainDialogFormCssNamespace.ICreateDomainDialogFormCss;
};

export = CreateDomainDialogFormCssModule;
