declare namespace CalamityBannerModuleCssNamespace {
  export interface ICalamityBannerModuleCss {
    calamityBannerInner: string;
  }
}

declare const CalamityBannerModuleCssModule: CalamityBannerModuleCssNamespace.ICalamityBannerModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CalamityBannerModuleCssNamespace.ICalamityBannerModuleCss;
};

export = CalamityBannerModuleCssModule;
