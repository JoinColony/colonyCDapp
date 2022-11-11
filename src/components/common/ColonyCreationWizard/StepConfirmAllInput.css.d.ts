declare namespace StepConfirmAllInputCssNamespace {
  export interface IStepConfirmAllInputCss {
    buttons: string;
    cardElement: string;
    cardRow: string;
    finalContainer: string;
    main: string;
    mappings: string;
    names: string;
    paragraph: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const StepConfirmAllInputCssModule: StepConfirmAllInputCssNamespace.IStepConfirmAllInputCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StepConfirmAllInputCssNamespace.IStepConfirmAllInputCss;
};

export = StepConfirmAllInputCssModule;
