declare namespace DialogSectionCssNamespace {
  export interface IDialogSectionCss {
    alignCenter: string;
    alignRight: string;
    borderBottom: string;
    borderColor: string;
    borderGrey: string;
    borderNone: string;
    borderTop: string;
    main: string;
    themeFooter: string;
    themeHeading: string;
    themeSidePadding: string;
  }
}

declare const DialogSectionCssModule: DialogSectionCssNamespace.IDialogSectionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DialogSectionCssNamespace.IDialogSectionCss;
};

export = DialogSectionCssModule;
