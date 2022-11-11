declare namespace StepSelectTokenCssNamespace {
  export interface IStepSelectTokenCss {
    buttons: string;
    header: string;
    input: string;
    labelContainer: string;
    linkToOtherStep: string;
    main: string;
    mappings: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    title: string;
    tokenDetails: string;
    version: string;
  }
}

declare const StepSelectTokenCssModule: StepSelectTokenCssNamespace.IStepSelectTokenCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StepSelectTokenCssNamespace.IStepSelectTokenCss;
};

export = StepSelectTokenCssModule;
