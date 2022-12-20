declare namespace AvatarUploaderCssNamespace {
  export interface IAvatarUploaderCss {
    buttonContainer: string;
    disabled: string;
    dropzone: string;
    dropzoneAccept: string;
    dropzoneNoButtonsVariant: string;
    filesContainer: string;
    inputStatus: string;
    overlay: string;
  }
}

declare const AvatarUploaderCssModule: AvatarUploaderCssNamespace.IAvatarUploaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AvatarUploaderCssNamespace.IAvatarUploaderCss;
};

export = AvatarUploaderCssModule;
