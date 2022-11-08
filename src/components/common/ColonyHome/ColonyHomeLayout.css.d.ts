declare namespace ColonyHomeLayoutCssNamespace {
  export interface IColonyHomeLayoutCss {
    contentActionsPanel: string;
    domainsDropdownContainer: string;
    events: string;
    leftAside: string;
    main: string;
    mainContent: string;
    mainContentGrid: string;
    minimalGrid: string;
    rightAside: string;
  }
}

declare const ColonyHomeLayoutCssModule: ColonyHomeLayoutCssNamespace.IColonyHomeLayoutCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyHomeLayoutCssNamespace.IColonyHomeLayoutCss;
};

export = ColonyHomeLayoutCssModule;
