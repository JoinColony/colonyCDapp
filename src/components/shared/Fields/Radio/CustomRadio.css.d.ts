declare namespace CustomRadioCssNamespace {
  export interface ICustomRadioCss {
    checkedCustomRadioIcon: string;
    content: string;
    customRadioCheck: string;
    customRadioIcon: string;
    description: string;
    directionVertical: string;
    icon: string;
    input: string;
    label: string;
    main: string;
    stateIsChecked: string;
    stateIsDisabled: string;
    themeDanger: string;
    themeGreyWithCircle: string;
    themePrimary: string;
  }
}

declare const CustomRadioCssModule: CustomRadioCssNamespace.ICustomRadioCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CustomRadioCssNamespace.ICustomRadioCss;
};

export = CustomRadioCssModule;
