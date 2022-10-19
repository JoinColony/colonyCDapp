declare namespace DomainDropdownItemCssNamespace {
  export interface IDomainDropdownItemCss {
    activeDomain: string;
    childDomainIcon: string;
    color: string;
    description: string;
    editButton: string;
    editButtonCol: string;
    headingWrapper: string;
    main: string;
    mainContent: string;
    rootText: string;
    title: string;
  }
}

declare const DomainDropdownItemCssModule: DomainDropdownItemCssNamespace.IDomainDropdownItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DomainDropdownItemCssNamespace.IDomainDropdownItemCss;
};

export = DomainDropdownItemCssModule;
