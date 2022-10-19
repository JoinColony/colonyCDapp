declare namespace CreateDomainButtonCssNamespace {
  export interface ICreateDomainButtonCss {
    buttonIcon: string;
    container: string;
    main: string;
  }
}

declare const CreateDomainButtonCssModule: CreateDomainButtonCssNamespace.ICreateDomainButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreateDomainButtonCssNamespace.ICreateDomainButtonCss;
};

export = CreateDomainButtonCssModule;
