declare namespace SubMenuModuleCssNamespace {
  export interface ISubMenuModuleCss {
    linkItem: string;
    subMenuList: string;
  }
}

declare const SubMenuModuleCssModule: SubMenuModuleCssNamespace.ISubMenuModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SubMenuModuleCssNamespace.ISubMenuModuleCss;
};

export = SubMenuModuleCssModule;
