declare namespace ImageCarouselModuleCssNamespace {
  export interface IImageCarouselModuleCss {
    container: string;
    dot: string;
    dotSelected: string;
    dots: string;
    embla: string;
    emblaContainer: string;
    emblaSlide: string;
    image: string;
  }
}

declare const ImageCarouselModuleCssModule: ImageCarouselModuleCssNamespace.IImageCarouselModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ImageCarouselModuleCssNamespace.IImageCarouselModuleCss;
};

export = ImageCarouselModuleCssModule;
