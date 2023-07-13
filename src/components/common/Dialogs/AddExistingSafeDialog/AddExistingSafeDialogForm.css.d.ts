declare namespace AddExistingSafeDialogFormCssNamespace {
  export interface IAddExistingSafeDialogFormCss {
    chainName: string;
    copied: string;
    headingContainer: string;
    main: string;
    safe: string;
    safeNameContainer: string;
    step3Instructions: string;
    subtitle: string;
    summaryRow: string;
    tooltip: string;
    wideButton: string;
  }
}

declare const AddExistingSafeDialogFormCssModule: AddExistingSafeDialogFormCssNamespace.IAddExistingSafeDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AddExistingSafeDialogFormCssNamespace.IAddExistingSafeDialogFormCss;
};

export = AddExistingSafeDialogFormCssModule;
