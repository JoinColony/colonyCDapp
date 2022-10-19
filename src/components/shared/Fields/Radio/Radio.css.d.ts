declare namespace RadioCssNamespace {
  export interface IRadioCss {
    checkmark: string;
    delegate: string;
    directionHorizontal: string;
    directionVertical: string;
    labelContainer: string;
    main: string;
    radio: string;
    stateIsChecked: string;
    stateIsDisabled: string;
    themeButtonGroup: string;
    themeColorPicker: string;
    themeFakeCheckbox: string;
  }
}

declare const RadioCssModule: RadioCssNamespace.IRadioCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RadioCssNamespace.IRadioCss;
};

export = RadioCssModule;
