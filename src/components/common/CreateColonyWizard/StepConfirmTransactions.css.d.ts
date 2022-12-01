declare namespace StepConfirmTransactionsCssNamespace {
  export interface IStepConfirmTransactionsCss {
    deploymentError: string;
    linkToColony: string;
    main: string;
  }
}

declare const StepConfirmTransactionsCssModule: StepConfirmTransactionsCssNamespace.IStepConfirmTransactionsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StepConfirmTransactionsCssNamespace.IStepConfirmTransactionsCss;
};

export = StepConfirmTransactionsCssModule;
