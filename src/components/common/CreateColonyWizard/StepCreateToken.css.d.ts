declare namespace StepCreateTokenCssNamespace {
  export interface IStepCreateTokenCss {
    inputFieldWrapper: string;
    inputFields: string;
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

declare const StepCreateTokenCssModule: StepCreateTokenCssNamespace.IStepCreateTokenCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StepCreateTokenCssNamespace.IStepCreateTokenCss;
};

export = StepCreateTokenCssModule;
