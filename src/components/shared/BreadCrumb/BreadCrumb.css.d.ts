declare namespace BreadCrumbCssNamespace {
  export interface IBreadCrumbCss {
    arrow: string;
    breadCrumble: string;
    element: string;
    elementLast: string;
    invisibleLink: string;
    main: string;
  }
}

declare const BreadCrumbCssModule: BreadCrumbCssNamespace.IBreadCrumbCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: BreadCrumbCssNamespace.IBreadCrumbCss;
};

export = BreadCrumbCssModule;
