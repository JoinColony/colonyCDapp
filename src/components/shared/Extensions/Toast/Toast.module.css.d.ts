declare namespace ToastModuleCssNamespace {
  export interface IToastModuleCss {
    toastNotification: string;
  }
}

declare const ToastModuleCssModule: ToastModuleCssNamespace.IToastModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ToastModuleCssNamespace.IToastModuleCss;
};

export = ToastModuleCssModule;
