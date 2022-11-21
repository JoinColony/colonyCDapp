declare namespace StepUserEmailCssNamespace {
  export interface IStepUserEmailCss {
    emailPermissions: string;
    emailPermissionsRow: string;
    tooltip: string;
  }
}

declare const StepUserEmailCssModule: StepUserEmailCssNamespace.IStepUserEmailCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StepUserEmailCssNamespace.IStepUserEmailCss;
};

export = StepUserEmailCssModule;
