declare namespace CreatePaymentDialogFormCssNamespace {
  export interface ICreatePaymentDialogFormCss {
    noOneTxExtension: string;
    singleUserContainer: string;
    warningContainer: string;
    warningLabel: string;
    warningText: string;
  }
}

declare const CreatePaymentDialogFormCssModule: CreatePaymentDialogFormCssNamespace.ICreatePaymentDialogFormCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CreatePaymentDialogFormCssNamespace.ICreatePaymentDialogFormCss;
};

export = CreatePaymentDialogFormCssModule;
