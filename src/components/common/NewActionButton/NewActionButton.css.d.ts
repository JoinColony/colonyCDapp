declare namespace NewActionButtonCssNamespace {
  export interface INewActionButtonCss {
    tooltipWrapper: string;
  }
}

declare const NewActionButtonCssModule: NewActionButtonCssNamespace.INewActionButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NewActionButtonCssNamespace.INewActionButtonCss;
};

export = NewActionButtonCssModule;
