declare namespace TransferFundsDialogFormCssNamespace {
  export interface ITransferFundsDialogFormCss {
    amountContainer: string;
    cannotCreateMotion: string;
    domainPotBalance: string;
    domainSelects: string;
    headingContainer: string;
    mappings: string;
    modalHeading: string;
    motionVoteDomain: string;
    names: string;
    permissionsError: string;
    permissionsRequired: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    title: string;
    tokenAmount: string;
    tokenAmountContainer: string;
    tokenAmountSelect: string;
    tokenAmountUsd: string;
    transferIcon: string;
    version: string;
    wideButton: string;
  }
}

declare const TransferFundsDialogFormCssModule: TransferFundsDialogFormCssNamespace.ITransferFundsDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransferFundsDialogFormCssNamespace.ITransferFundsDialogFormCss;
};

export = TransferFundsDialogFormCssModule;
