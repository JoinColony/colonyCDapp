declare namespace CheckboxCssNamespace {
  export interface ICheckboxCss {
    checkbox: string;
    checkmark: string;
    delegate: string;
    directionHorizontal: string;
    directionVertical: string;
    focusVisible: string;
    main: string;
    mappings: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    stateIsChecked: string;
    themeDark: string;
    themePink: string;
    version: string;
  }
}

declare const CheckboxCssModule: CheckboxCssNamespace.ICheckboxCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CheckboxCssNamespace.ICheckboxCss;
};

export = CheckboxCssModule;
