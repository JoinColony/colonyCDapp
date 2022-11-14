declare namespace FileUploadCssNamespace {
  export interface IFileUploadCss {
    browseButton: string;
    dropzone: string;
    dropzoneAccept: string;
    dropzoneReject: string;
    filesContainer: string;
    main: string;
    placeholderText: string;
    placeholderTextDisabled: string;
  }
}

declare const FileUploadCssModule: FileUploadCssNamespace.IFileUploadCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FileUploadCssNamespace.IFileUploadCss;
};

export = FileUploadCssModule;
