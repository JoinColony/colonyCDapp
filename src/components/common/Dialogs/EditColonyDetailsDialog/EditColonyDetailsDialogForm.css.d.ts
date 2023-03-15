declare namespace EditColonyDetailsDialogFormCssNamespace {
  export interface IEditColonyDetailsDialogFormCss {
    avatarUploadError: string;
    cannotCreateMotion: string;
    logoPlaceholder: string;
    smallText: string;
    tinyText: string;
    title: string;
  }
}

declare const EditColonyDetailsDialogFormCssModule: EditColonyDetailsDialogFormCssNamespace.IEditColonyDetailsDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: EditColonyDetailsDialogFormCssNamespace.IEditColonyDetailsDialogFormCss;
};

export = EditColonyDetailsDialogFormCssModule;
