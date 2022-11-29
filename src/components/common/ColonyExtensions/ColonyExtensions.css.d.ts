declare namespace ColonyExtensionsCssNamespace {
  export interface IColonyExtensionsCss {
    cards: string;
    description: string;
    heading: string;
    lineHeight: string;
    main: string;
    sections: string;
  }
}

declare const ColonyExtensionsCssModule: ColonyExtensionsCssNamespace.IColonyExtensionsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyExtensionsCssNamespace.IColonyExtensionsCss;
};

export = ColonyExtensionsCssModule;
