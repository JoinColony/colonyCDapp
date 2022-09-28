declare namespace ConfirmDialogCssNamespace {
  export interface IConfirmDialogCss {
    content: string;
    title: string;
    wideButton: string;
  }
}

declare const ConfirmDialogCssModule: ConfirmDialogCssNamespace.IConfirmDialogCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ConfirmDialogCssNamespace.IConfirmDialogCss;
};

export = ConfirmDialogCssModule;
