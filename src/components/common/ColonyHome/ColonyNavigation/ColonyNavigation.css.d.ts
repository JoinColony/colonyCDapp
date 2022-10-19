declare namespace ColonyNavigationCssNamespace {
  export interface IColonyNavigationCss {
    main: string;
  }
}

declare const ColonyNavigationCssModule: ColonyNavigationCssNamespace.IColonyNavigationCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColonyNavigationCssNamespace.IColonyNavigationCss;
};

export = ColonyNavigationCssModule;
