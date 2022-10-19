declare namespace RadioGroupCssNamespace {
  export interface IRadioGroupCss {
    themeButtonGroup: string;
  }
}

declare const RadioGroupCssModule: RadioGroupCssNamespace.IRadioGroupCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RadioGroupCssNamespace.IRadioGroupCss;
};

export = RadioGroupCssModule;
