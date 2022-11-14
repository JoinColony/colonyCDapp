declare namespace StepBarCssNamespace {
  export interface IStepBarCss {
    main: string;
    progressContainer: string;
    stepCounter: string;
  }
}

declare const StepBarCssModule: StepBarCssNamespace.IStepBarCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StepBarCssNamespace.IStepBarCss;
};

export = StepBarCssModule;
