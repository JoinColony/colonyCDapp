declare namespace StepConfirmTransactionCssNamespace {
  export interface IStepConfirmTransactionCss {
    main: string;
  }
}

declare const StepConfirmTransactionCssModule: StepConfirmTransactionCssNamespace.IStepConfirmTransactionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StepConfirmTransactionCssNamespace.IStepConfirmTransactionCss;
};

export = StepConfirmTransactionCssModule;
