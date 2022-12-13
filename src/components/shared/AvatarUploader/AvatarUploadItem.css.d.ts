declare namespace AvatarUploadItemCssNamespace {
  export interface IAvatarUploadItemCss {
    error: string;
    loader: string;
    main: string;
    overlay: string;
    previewImage: string;
  }
}

declare const AvatarUploadItemCssModule: AvatarUploadItemCssNamespace.IAvatarUploadItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AvatarUploadItemCssNamespace.IAvatarUploadItemCss;
};

export = AvatarUploadItemCssModule;
