declare namespace TabsModuleCssNamespace {
  export interface ITabsModuleCss {
    navButton: string;
    navLeftButton: string;
    navRightButton: string;
    notificationNumber: string;
    panel: string;
    tabList: string;
  }
}

declare const TabsModuleCssModule: TabsModuleCssNamespace.ITabsModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TabsModuleCssNamespace.ITabsModuleCss;
};

export = TabsModuleCssModule;
