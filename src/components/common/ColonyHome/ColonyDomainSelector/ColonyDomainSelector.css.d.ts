declare namespace ColonyDomainSelectorCssNamespace {
  export interface IColonyDomainSelectorCss {
    activeItem: string;
    activeItemLabel: string;
  }
}

declare const ColonyDomainSelectorCssModule: ColonyDomainSelectorCssNamespace.IColonyDomainSelectorCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyDomainSelectorCssNamespace.IColonyDomainSelectorCss;
};

export = ColonyDomainSelectorCssModule;
