declare namespace LinkItemModuleCssNamespace {
  export interface ILinkItemModuleCss {
    description: string;
    itemWrapper: string;
    link: string;
    title: string;
  }
}

declare const LinkItemModuleCssModule: LinkItemModuleCssNamespace.ILinkItemModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LinkItemModuleCssNamespace.ILinkItemModuleCss;
};

export = LinkItemModuleCssModule;
