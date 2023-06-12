declare namespace PageTitleModuleCssNamespace {
  export interface IPageTitleModuleCss {
    wrapper: string;
  }
}

declare const PageTitleModuleCssModule: PageTitleModuleCssNamespace.IPageTitleModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PageTitleModuleCssNamespace.IPageTitleModuleCss;
};

export = PageTitleModuleCssModule;
