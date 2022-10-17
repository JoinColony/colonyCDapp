declare namespace SelectOptionCssNamespace {
  export interface ISelectOptionCss {
    checkedMsg: string;
    main: string;
    selectedHelpText: string;
    stateBordered: string;
    stateIsBasicLabel: string;
    value: string;
  }
}

declare const SelectOptionCssModule: SelectOptionCssNamespace.ISelectOptionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SelectOptionCssNamespace.ISelectOptionCss;
};

export = SelectOptionCssModule;
