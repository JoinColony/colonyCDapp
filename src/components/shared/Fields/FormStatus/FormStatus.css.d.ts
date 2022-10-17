declare namespace FormStatusCssNamespace {
  export interface IFormStatusCss {
    error: string;
    info: string;
    main: string;
    text: string;
  }
}

declare const FormStatusCssModule: FormStatusCssNamespace.IFormStatusCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FormStatusCssNamespace.IFormStatusCss;
};

export = FormStatusCssModule;
