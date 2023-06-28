declare namespace StepUserEmailCssNamespace {
  export interface IStepUserEmailCss {
    emailPermissions: string;
    emailPermissionsRow: string;
    mappings: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    tooltip: string;
    version: string;
  }
}

declare const StepUserEmailCssModule: StepUserEmailCssNamespace.IStepUserEmailCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StepUserEmailCssNamespace.IStepUserEmailCss;
};

export = StepUserEmailCssModule;
