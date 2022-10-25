declare namespace SubscribedColoniesListCssNamespace {
  export interface ISubscribedColoniesListCss {
    activeColony: string;
    item: string;
    itemImage: string;
    itemLink: string;
    itemLinkSize: string;
    itemMarginBotton: string;
    loadingColonies: string;
    main: string;
    newColonyIcon: string;
    newColonyItem: string;
    scrollableContainer: string;
  }
}

declare const SubscribedColoniesListCssModule: SubscribedColoniesListCssNamespace.ISubscribedColoniesListCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SubscribedColoniesListCssNamespace.ISubscribedColoniesListCss;
};

export = SubscribedColoniesListCssModule;
