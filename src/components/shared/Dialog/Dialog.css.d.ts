declare namespace DialogCssNamespace {
  export interface IDialogCss {
    closeIconButton: string;
    dialogOuterActions: string;
    main: string;
    modal: string;
  }
}

declare const DialogCssModule: DialogCssNamespace.IDialogCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DialogCssNamespace.IDialogCss;
};

export = DialogCssModule;
