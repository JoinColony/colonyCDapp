declare namespace LandingPageCssNamespace {
  export interface ILandingPageCss {
    item: string;
    itemIcon: string;
    itemLink: string;
    itemLoading: string;
    itemTitle: string;
    main: string;
    mappings: string;
    names: string;
    navHeight: string;
    query428: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    title: string;
    version: string;
  }
}

declare const LandingPageCssModule: LandingPageCssNamespace.ILandingPageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LandingPageCssNamespace.ILandingPageCss;
};

export = LandingPageCssModule;
