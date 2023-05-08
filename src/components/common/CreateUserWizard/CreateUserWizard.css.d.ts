declare namespace CreateUserWizardCssNamespace {
  export interface ICreateUserWizardCss {
    buttons: string;
    main: string;
    mappings: string;
    nameForm: string;
    names: string;
    paragraph: string;
    query428: string;
    reminder: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const CreateUserWizardCssModule: CreateUserWizardCssNamespace.ICreateUserWizardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreateUserWizardCssNamespace.ICreateUserWizardCss;
};

export = CreateUserWizardCssModule;
