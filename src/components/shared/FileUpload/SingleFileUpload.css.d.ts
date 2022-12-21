declare namespace SingleFileUploadCssNamespace {
  export interface ISingleFileUploadCss {
    dropzone: string;
    dropzoneAccept: string;
    dropzoneReject: string;
    main: string;
  }
}

declare const SingleFileUploadCssModule: SingleFileUploadCssNamespace.ISingleFileUploadCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SingleFileUploadCssNamespace.ISingleFileUploadCss;
};

export = SingleFileUploadCssModule;
