declare namespace MainNavigationModuleCssNamespace {
  export interface IMainNavigationModuleCss {
    mobileButtons: string;
  }
}

declare const MainNavigationModuleCssModule: MainNavigationModuleCssNamespace.IMainNavigationModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MainNavigationModuleCssNamespace.IMainNavigationModuleCss;
};

export = MainNavigationModuleCssModule;
