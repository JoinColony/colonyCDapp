declare namespace CloseButtonModuleCssNamespace {
  export interface ICloseButtonModuleCss {
    closeButton: string;
  }
}

declare const CloseButtonModuleCssModule: CloseButtonModuleCssNamespace.ICloseButtonModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CloseButtonModuleCssNamespace.ICloseButtonModuleCss;
};

export = CloseButtonModuleCssModule;
