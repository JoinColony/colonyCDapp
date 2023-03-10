declare namespace TransferFundsDialogFormCssNamespace {
  export interface ITransferFundsDialogFormCss {
    permissionsRequired: string;
  }
}

declare const TransferFundsDialogFormCssModule: TransferFundsDialogFormCssNamespace.ITransferFundsDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransferFundsDialogFormCssNamespace.ITransferFundsDialogFormCss;
};

export = TransferFundsDialogFormCssModule;
