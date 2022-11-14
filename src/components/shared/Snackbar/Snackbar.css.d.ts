declare namespace SnackbarCssNamespace {
  export interface ISnackbarCss {
    container: string;
    containerError: string;
    containerSuccess: string;
    dot: string;
    dotError: string;
    dotSuccess: string;
    fadeIn: string;
    fadeOut: string;
    msgText: string;
  }
}

declare const SnackbarCssModule: SnackbarCssNamespace.ISnackbarCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SnackbarCssNamespace.ISnackbarCss;
};

export = SnackbarCssModule;
