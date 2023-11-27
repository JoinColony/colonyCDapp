declare namespace UploadAddressesCssNamespace {
  export interface IUploadAddressesCss {
    actionsContainer: string;
    actionsSubContainer: string;
    container: string;
    inputContainer: string;
    uploaderContainer: string;
  }
}

declare const UploadAddressesCssModule: UploadAddressesCssNamespace.IUploadAddressesCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UploadAddressesCssNamespace.IUploadAddressesCss;
};

export = UploadAddressesCssModule;
