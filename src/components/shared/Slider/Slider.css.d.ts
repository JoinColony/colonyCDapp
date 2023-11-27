declare namespace SliderCssNamespace {
  export interface ISliderCss {
    danger: string;
    main: string;
    primary: string;
  }
}

declare const SliderCssModule: SliderCssNamespace.ISliderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SliderCssNamespace.ISliderCss;
};

export = SliderCssModule;
