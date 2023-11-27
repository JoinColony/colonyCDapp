declare namespace DialogHeadingCssNamespace {
  export interface IDialogHeadingCss {
    headingContainer: string;
    modalHeading: string;
    motionVoteDomain: string;
  }
}

declare const DialogHeadingCssModule: DialogHeadingCssNamespace.IDialogHeadingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DialogHeadingCssNamespace.IDialogHeadingCss;
};

export = DialogHeadingCssModule;
