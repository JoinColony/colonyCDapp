declare namespace LandingPageCssNamespace {
  export interface ILandingPageCss {
    item: string;
    itemIcon: string;
    itemLink: string;
    itemLoading: string;
    itemTitle: string;
    main: string;
    title: string;
  }
}

declare const LandingPageCssModule: LandingPageCssNamespace.ILandingPageCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LandingPageCssNamespace.ILandingPageCss;
};

export = LandingPageCssModule;
