declare namespace ConfirmButtonCssNamespace {
  export interface IConfirmButtonCss {
    confirmContainer: string;
    confirmText: string;
    separator: string;
  }
}

declare const ConfirmButtonCssModule: ConfirmButtonCssNamespace.IConfirmButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ConfirmButtonCssNamespace.IConfirmButtonCss;
};

export = ConfirmButtonCssModule;
