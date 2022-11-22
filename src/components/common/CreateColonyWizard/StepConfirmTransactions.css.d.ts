declare namespace StepConfirmTransactionsCssNamespace {
  export interface IStepConfirmTransactionsCss {
    container: string;
    containerGasPrice: string;
    deploymentError: string;
    linkToColony: string;
    main: string;
    mappings: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const StepConfirmTransactionsCssModule: StepConfirmTransactionsCssNamespace.IStepConfirmTransactionsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StepConfirmTransactionsCssNamespace.IStepConfirmTransactionsCss;
};

export = StepConfirmTransactionsCssModule;
