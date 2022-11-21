declare namespace CreateUserWizardCssNamespace {
  export interface ICreateUserWizardCss {
    buttons: string;
    main: string;
    nameForm: string;
    paragraph: string;
    reminder: string;
  }
}

declare const CreateUserWizardCssModule: CreateUserWizardCssNamespace.ICreateUserWizardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreateUserWizardCssNamespace.ICreateUserWizardCss;
};

export = CreateUserWizardCssModule;
