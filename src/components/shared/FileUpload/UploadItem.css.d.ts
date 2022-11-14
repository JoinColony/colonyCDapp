declare namespace UploadItemCssNamespace {
  export interface IUploadItemCss {
    fileInfo: string;
    itemIcon: string;
    itemProgress: string;
    uploadItem: string;
  }
}

declare const UploadItemCssModule: UploadItemCssNamespace.IUploadItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UploadItemCssNamespace.IUploadItemCss;
};

export = UploadItemCssModule;
