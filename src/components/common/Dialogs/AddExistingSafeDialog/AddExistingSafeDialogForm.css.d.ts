declare namespace AddExistingSafeDialogFormCssNamespace {
  export interface IAddExistingSafeDialogFormCss {
    copied: string;
    headingContainer: string;
    instructions: string;
    main: string;
    subtitle: string;
    tooltip: string;
    wideButton: string;
  }
}

declare const AddExistingSafeDialogFormCssModule: AddExistingSafeDialogFormCssNamespace.IAddExistingSafeDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AddExistingSafeDialogFormCssNamespace.IAddExistingSafeDialogFormCss;
};

export = AddExistingSafeDialogFormCssModule;
