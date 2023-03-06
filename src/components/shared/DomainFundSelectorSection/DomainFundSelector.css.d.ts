declare namespace DomainFundSelectorCssNamespace {
  export interface IDomainFundSelectorCss {
    domainPotBalance: string;
    selectBetweenDomainsContainer: string;
    selectDomainContainer: string;
    transferIcon: string;
  }
}

declare const DomainFundSelectorCssModule: DomainFundSelectorCssNamespace.IDomainFundSelectorCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DomainFundSelectorCssNamespace.IDomainFundSelectorCss;
};

export = DomainFundSelectorCssModule;
