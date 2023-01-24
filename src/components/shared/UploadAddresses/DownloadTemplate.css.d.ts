declare namespace DownloadTemplateCssNamespace {
  export interface IDownloadTemplateCss {
    link: string;
  }
}

declare const DownloadTemplateCssModule: DownloadTemplateCssNamespace.IDownloadTemplateCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DownloadTemplateCssNamespace.IDownloadTemplateCss;
};

export = DownloadTemplateCssModule;
