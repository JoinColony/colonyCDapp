declare namespace ModalModuleCssNamespace {
  export interface IModalModuleCss {
    closeIcon: string;
    icon: string;
    inner: string;
    modal: string;
    overlay: string;
  }
}

declare const ModalModuleCssModule: ModalModuleCssNamespace.IModalModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ModalModuleCssNamespace.IModalModuleCss;
};

export = ModalModuleCssModule;
