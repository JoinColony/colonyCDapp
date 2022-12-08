declare namespace StepTokenChoiceCssNamespace {
  export interface IStepTokenChoiceCss {
    content: string;
    instructions: string;
    learnMore: string;
    link: string;
    rowArrow: string;
    subtitleWithExample: string;
  }
}

declare const StepTokenChoiceCssModule: StepTokenChoiceCssNamespace.IStepTokenChoiceCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StepTokenChoiceCssNamespace.IStepTokenChoiceCss;
};

export = StepTokenChoiceCssModule;
