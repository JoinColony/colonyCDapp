declare namespace ColonyDomainDescriptionCssNamespace {
  export interface IColonyDomainDescriptionCss {
    description: string;
    main: string;
    name: string;
  }
}

declare const ColonyDomainDescriptionCssModule: ColonyDomainDescriptionCssNamespace.IColonyDomainDescriptionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyDomainDescriptionCssNamespace.IColonyDomainDescriptionCss;
};

export = ColonyDomainDescriptionCssModule;
