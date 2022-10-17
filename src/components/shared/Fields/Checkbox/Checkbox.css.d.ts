declare namespace CheckboxCssNamespace {
  export interface ICheckboxCss {
    checkbox: string;
    checkmark: string;
    delegate: string;
    directionHorizontal: string;
    directionVertical: string;
    main: string;
    stateDisabled: string;
    stateIsChecked: string;
    themeDark: string;
  }
}

declare const CheckboxCssModule: CheckboxCssNamespace.ICheckboxCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CheckboxCssNamespace.ICheckboxCss;
};

export = CheckboxCssModule;
