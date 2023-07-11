declare namespace RemoveSafeDialogFormCssNamespace {
  export interface IRemoveSafeDialogFormCss {
    content: string;
    description: string;
    emptySafeList: string;
    title: string;
  }
}

declare const RemoveSafeDialogFormCssModule: RemoveSafeDialogFormCssNamespace.IRemoveSafeDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RemoveSafeDialogFormCssNamespace.IRemoveSafeDialogFormCss;
};

export = RemoveSafeDialogFormCssModule;
