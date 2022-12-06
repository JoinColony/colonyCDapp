declare namespace TabListCssNamespace {
  export interface ITabListCss {
    container: string;
    main: string;
    tabListContainerHeight: string;
  }
}

declare const TabListCssModule: TabListCssNamespace.ITabListCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TabListCssNamespace.ITabListCss;
};

export = TabListCssModule;
