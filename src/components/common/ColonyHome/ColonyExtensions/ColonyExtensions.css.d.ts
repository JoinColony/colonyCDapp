declare namespace ColonyExtensionsCssNamespace {
  export interface IColonyExtensionsCss {
    extension: string;
    invisibleLink: string;
    main: string;
  }
}

declare const ColonyExtensionsCssModule: ColonyExtensionsCssNamespace.IColonyExtensionsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyExtensionsCssNamespace.IColonyExtensionsCss;
};

export = ColonyExtensionsCssModule;
