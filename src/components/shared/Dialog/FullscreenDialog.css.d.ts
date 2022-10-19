declare namespace FullscreenDialogCssNamespace {
  export interface IFullscreenDialogCss {
    closeIconButton: string;
    dialogOuterActions: string;
    main: string;
    modal: string;
    overlay: string;
  }
}

declare const FullscreenDialogCssModule: FullscreenDialogCssNamespace.IFullscreenDialogCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FullscreenDialogCssNamespace.IFullscreenDialogCss;
};

export = FullscreenDialogCssModule;
