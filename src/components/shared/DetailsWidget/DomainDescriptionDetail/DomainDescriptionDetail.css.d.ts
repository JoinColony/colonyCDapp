declare namespace DomainDescriptionDetailCssNamespace {
  export interface IDomainDescriptionDetailCss {
    domainDescription: string;
  }
}

declare const DomainDescriptionDetailCssModule: DomainDescriptionDetailCssNamespace.IDomainDescriptionDetailCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DomainDescriptionDetailCssNamespace.IDomainDescriptionDetailCss;
};

export = DomainDescriptionDetailCssModule;
