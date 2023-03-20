declare namespace ColorSelectCssNamespace {
  export interface IColorSelectCss {
    main: string;
  }
}

declare const ColorSelectCssModule: ColorSelectCssNamespace.IColorSelectCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColorSelectCssNamespace.IColorSelectCss;
};

export = ColorSelectCssModule;
