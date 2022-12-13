declare namespace TabPanelCssNamespace {
  export interface ITabPanelCss {
    main: string;
    selected: string;
  }
}

declare const TabPanelCssModule: TabPanelCssNamespace.ITabPanelCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TabPanelCssNamespace.ITabPanelCss;
};

export = TabPanelCssModule;
