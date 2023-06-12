declare namespace RadioListModuleCssNamespace {
  export interface IRadioListModuleCss {
    description: string;
    label: string;
    radioButtonLabel: string;
  }
}

declare const RadioListModuleCssModule: RadioListModuleCssNamespace.IRadioListModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RadioListModuleCssNamespace.IRadioListModuleCss;
};

export = RadioListModuleCssModule;
