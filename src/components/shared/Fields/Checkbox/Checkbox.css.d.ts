declare namespace CheckboxCssNamespace {
  export interface ICheckboxCss {
    checkbox: string;
    checkmark: string;
    delegate: string;
    directionHorizontal: string;
    directionVertical: string;
    main: string;
    mappings: string;
    names: string;
    query850: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    stateDisabled: string;
    stateIsChecked: string;
    themeDark: string;
    version: string;
  }
}

declare const CheckboxCssModule: CheckboxCssNamespace.ICheckboxCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CheckboxCssNamespace.ICheckboxCss;
};

export = CheckboxCssModule;
