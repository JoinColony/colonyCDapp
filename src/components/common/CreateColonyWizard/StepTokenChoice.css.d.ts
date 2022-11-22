declare namespace StepTokenChoiceCssNamespace {
  export interface IStepTokenChoiceCss {
    content: string;
    link: string;
    rowArrow: string;
    subtitle: string;
    subtitleWithExample: string;
    subtitleWithExampleBox: string;
    title: string;
    titleAndButton: string;
  }
}

declare const StepTokenChoiceCssModule: StepTokenChoiceCssNamespace.IStepTokenChoiceCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StepTokenChoiceCssNamespace.IStepTokenChoiceCss;
};

export = StepTokenChoiceCssModule;
