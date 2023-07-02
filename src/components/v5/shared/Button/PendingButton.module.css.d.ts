declare namespace PendingButtonModuleCssNamespace {
  export interface IPendingButtonModuleCss {
    pending: string;
  }
}

declare const PendingButtonModuleCssModule: PendingButtonModuleCssNamespace.IPendingButtonModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PendingButtonModuleCssNamespace.IPendingButtonModuleCss;
};

export = PendingButtonModuleCssModule;
