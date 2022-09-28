declare namespace ModalCssNamespace {
  export interface IModalCss {
    main: string;
    mainAfterOpen: string;
    mainBeforeClose: string;
    overlay: string;
    overlayAfterOpen: string;
    overlayBeforeClose: string;
    overlayInvisible: string;
    portal: string;
  }
}

declare const ModalCssModule: ModalCssNamespace.IModalCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ModalCssNamespace.IModalCss;
};

export = ModalCssModule;
