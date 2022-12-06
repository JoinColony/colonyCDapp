declare namespace SubscribedColoniesListCssNamespace {
  export interface ISubscribedColoniesListCss {
    activeColony: string;
    dropdownItem: string;
    item: string;
    itemImage: string;
    itemLink: string;
    itemLinkSize: string;
    itemLinkSizeMobile: string;
    itemMarginBotton: string;
    loadingColonies: string;
    main: string;
    mappings: string;
    names: string;
    newColonyIcon: string;
    newColonyItem: string;
    query700: string;
    scrollableContainer: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const SubscribedColoniesListCssModule: SubscribedColoniesListCssNamespace.ISubscribedColoniesListCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SubscribedColoniesListCssNamespace.ISubscribedColoniesListCss;
};

export = SubscribedColoniesListCssModule;
