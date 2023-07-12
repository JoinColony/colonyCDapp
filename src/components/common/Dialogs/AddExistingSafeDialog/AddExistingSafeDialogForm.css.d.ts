declare namespace AddExistingSafeDialogFormCssNamespace {
  export interface IAddExistingSafeDialogFormCss {
    chainName: string;
    chainSelect: string;
    copied: string;
    copyable: string;
    copyableContainer: string;
    fat: string;
    headingContainer: string;
    info: string;
    instructions: string;
    learnMoreLink: string;
    main: string;
    moduleAddressSubtitle: string;
    moduleContractAddressContainer: string;
    moduleLabel: string;
    moduleLinkSection: string;
    safe: string;
    safeNameContainer: string;
    step1Subtitle: string;
    step3Instructions: string;
    subtitle: string;
    summaryRow: string;
    tooltip: string;
    warning: string;
    wideButton: string;
  }
}

declare const AddExistingSafeDialogFormCssModule: AddExistingSafeDialogFormCssNamespace.IAddExistingSafeDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AddExistingSafeDialogFormCssNamespace.IAddExistingSafeDialogFormCss;
};

export = AddExistingSafeDialogFormCssModule;
