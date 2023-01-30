declare namespace DialogControlsCssNamespace {
  export interface IDialogControlsCss {
    wideButton: string;
  }
}

declare const DialogControlsCssModule: DialogControlsCssNamespace.IDialogControlsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DialogControlsCssNamespace.IDialogControlsCss;
};

export = DialogControlsCssModule;
