declare namespace StepUserNameCssNamespace {
  export interface IStepUserNameCss {
    buttons: string;
    main: string;
    nameForm: string;
    paragraph: string;
    reminder: string;
  }
}

declare const StepUserNameCssModule: StepUserNameCssNamespace.IStepUserNameCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: StepUserNameCssNamespace.IStepUserNameCss;
};

export = StepUserNameCssModule;
