declare namespace ImageCarouselModuleCssNamespace {
  export interface IImageCarouselModuleCss {
    carouselWrapper: string;
  }
}

declare const ImageCarouselModuleCssModule: ImageCarouselModuleCssNamespace.IImageCarouselModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ImageCarouselModuleCssNamespace.IImageCarouselModuleCss;
};

export = ImageCarouselModuleCssModule;
