declare namespace CustomRadioGroupCssNamespace {
  export interface ICustomRadioGroupCss {
    directionHorizontal: string;
    directionVertical: string;
    gapMedium: string;
  }
}

declare const CustomRadioGroupCssModule: CustomRadioGroupCssNamespace.ICustomRadioGroupCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CustomRadioGroupCssNamespace.ICustomRadioGroupCss;
};

export = CustomRadioGroupCssModule;
