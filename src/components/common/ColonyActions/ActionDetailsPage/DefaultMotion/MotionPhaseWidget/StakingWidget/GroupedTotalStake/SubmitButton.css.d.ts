declare namespace SubmitButtonCssNamespace {
  export interface ISubmitButtonCss {
    submitButtonContainer: string;
  }
}

declare const SubmitButtonCssModule: SubmitButtonCssNamespace.ISubmitButtonCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SubmitButtonCssNamespace.ISubmitButtonCss;
};

export = SubmitButtonCssModule;
