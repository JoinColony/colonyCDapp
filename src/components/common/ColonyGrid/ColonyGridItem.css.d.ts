declare namespace ColonyGridItemCssNamespace {
  export interface IColonyGridItemCss {
    displayName: string;
    horizontalMargin: string;
    loader: string;
    main: string;
  }
}

declare const ColonyGridItemCssModule: ColonyGridItemCssNamespace.IColonyGridItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyGridItemCssNamespace.IColonyGridItemCss;
};

export = ColonyGridItemCssModule;
