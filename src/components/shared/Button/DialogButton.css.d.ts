declare namespace DialogButtonCssNamespace {
  export interface IDialogButtonCss {
    tooltipWrapper: string;
  }
}

declare const DialogButtonCssModule: DialogButtonCssNamespace.IDialogButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DialogButtonCssNamespace.IDialogButtonCss;
};

export = DialogButtonCssModule;
