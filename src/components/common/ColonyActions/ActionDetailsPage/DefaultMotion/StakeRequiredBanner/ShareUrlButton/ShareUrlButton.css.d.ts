declare namespace ShareUrlButtonCssNamespace {
  export interface IShareUrlButtonCss {
    share: string;
  }
}

declare const ShareUrlButtonCssModule: ShareUrlButtonCssNamespace.IShareUrlButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ShareUrlButtonCssNamespace.IShareUrlButtonCss;
};

export = ShareUrlButtonCssModule;
