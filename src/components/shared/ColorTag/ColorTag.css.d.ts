declare namespace ColorTagCssNamespace {
  export interface IColorTagCss {
    color: string;
    main: string;
  }
}

declare const ColorTagCssModule: ColorTagCssNamespace.IColorTagCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ColorTagCssNamespace.IColorTagCss;
};

export = ColorTagCssModule;
