declare namespace ExtensionCardCssNamespace {
  export interface IExtensionCardCss {
    addButton: string;
    card: string;
    cardDescription: string;
    header: string;
    headerIcon: string;
    lineHeight: string;
    main: string;
    mappings: string;
    names: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    status: string;
    version: string;
  }
}

declare const ExtensionCardCssModule: ExtensionCardCssNamespace.IExtensionCardCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ExtensionCardCssNamespace.IExtensionCardCss;
};

export = ExtensionCardCssModule;
