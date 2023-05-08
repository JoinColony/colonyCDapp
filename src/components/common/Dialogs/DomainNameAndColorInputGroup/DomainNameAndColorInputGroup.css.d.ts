declare namespace DomainNameAndColorInputGroupCssNamespace {
  export interface IDomainNameAndColorInputGroupCss {
    domainName: string;
    mappings: string;
    nameAndColorContainer: string;
    names: string;
    query428: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const DomainNameAndColorInputGroupCssModule: DomainNameAndColorInputGroupCssNamespace.IDomainNameAndColorInputGroupCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DomainNameAndColorInputGroupCssNamespace.IDomainNameAndColorInputGroupCss;
};

export = DomainNameAndColorInputGroupCssModule;
