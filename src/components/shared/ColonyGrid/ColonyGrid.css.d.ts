declare namespace ColonyGridCssNamespace {
  export interface IColonyGridCss {
    colonyGrid: string;
    containerMarginLeft: string;
    createColonyLink: string;
    emptyText: string;
    loader: string;
    main: string;
    sectionTitle: string;
  }
}

declare const ColonyGridCssModule: ColonyGridCssNamespace.IColonyGridCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyGridCssNamespace.IColonyGridCss;
};

export = ColonyGridCssModule;
