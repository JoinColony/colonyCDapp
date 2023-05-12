declare namespace StepSelectTokenCssNamespace {
  export interface IStepSelectTokenCss {
    linkToOtherStep: string;
    main: string;
    mappings: string;
    names: string;
    query850: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const StepSelectTokenCssModule: StepSelectTokenCssNamespace.IStepSelectTokenCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StepSelectTokenCssNamespace.IStepSelectTokenCss;
};

export = StepSelectTokenCssModule;
