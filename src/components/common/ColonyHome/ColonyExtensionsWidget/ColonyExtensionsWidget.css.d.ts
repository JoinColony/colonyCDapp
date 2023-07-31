declare namespace ColonyExtensionsWidgetCssNamespace {
  export interface IColonyExtensionsWidgetCss {
    extension: string;
    invisibleLink: string;
    main: string;
  }
}

declare const ColonyExtensionsWidgetCssModule: ColonyExtensionsWidgetCssNamespace.IColonyExtensionsWidgetCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyExtensionsWidgetCssNamespace.IColonyExtensionsWidgetCss;
};

export = ColonyExtensionsWidgetCssModule;
