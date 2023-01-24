declare namespace EditColonyDetailsDialogFormCssNamespace {
  export interface IEditColonyDetailsDialogFormCss {
    avatarUploadError: string;
    cannotCreateMotion: string;
    headingContainer: string;
    logoPlaceholder: string;
    modalHeading: string;
    motionVoteDomain: string;
    noPermissionMessage: string;
    permissionLabel: string;
    smallText: string;
    tinyText: string;
    title: string;
    wideButton: string;
  }
}

declare const EditColonyDetailsDialogFormCssModule: EditColonyDetailsDialogFormCssNamespace.IEditColonyDetailsDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: EditColonyDetailsDialogFormCssNamespace.IEditColonyDetailsDialogFormCss;
};

export = EditColonyDetailsDialogFormCssModule;
