declare namespace CreatePaymentDialogFormCssNamespace {
  export interface ICreatePaymentDialogFormCss {
    domainPotBalance: string;
    domainSelects: string;
    headingContainer: string;
    mappings: string;
    modalHeading: string;
    motionVoteDomain: string;
    names: string;
    networkFee: string;
    noPermissionFromMessage: string;
    query700: string;
    singleUserContainer: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    tokenAmount: string;
    tokenAmountContainer: string;
    tokenAmountInputContainer: string;
    tokenAmountSelect: string;
    tokenAmountUsd: string;
    version: string;
    warningContainer: string;
    warningLabel: string;
    warningText: string;
    wideButton: string;
  }
}

declare const CreatePaymentDialogFormCssModule: CreatePaymentDialogFormCssNamespace.ICreatePaymentDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreatePaymentDialogFormCssNamespace.ICreatePaymentDialogFormCss;
};

export = CreatePaymentDialogFormCssModule;
