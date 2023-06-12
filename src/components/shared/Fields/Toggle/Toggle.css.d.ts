declare namespace ToggleCssNamespace {
  export interface IToggleCss {
    checkboxContainer: string;
    checked: string;
    container: string;
    delegate: string;
    icon: string;
    main: string;
    themeDanger: string;
    themePrimary: string;
    toggle: string;
    toggleDisabled: string;
    toggleHeight: string;
    toggleSwitch: string;
    toggleWidth: string;
  }
}

declare const ToggleCssModule: ToggleCssNamespace.IToggleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ToggleCssNamespace.IToggleCss;
};

export = ToggleCssModule;
