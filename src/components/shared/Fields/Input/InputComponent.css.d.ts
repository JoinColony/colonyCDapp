declare namespace InputComponentCssNamespace {
  export interface IInputComponentCss {
    alignRight: string;
    characterCounter: string;
    colorSchemaDark: string;
    colorSchemaGrey: string;
    colorSchemaTransparent: string;
    inputContainer: string;
    main: string;
    maxButton: string;
    paddingRightExtra: string;
    sizeMedium: string;
    sizeSmall: string;
    themeDotted: string;
    themeFat: string;
    themeMinimal: string;
    themeUnderlined: string;
  }
}

declare const InputComponentCssModule: InputComponentCssNamespace.IInputComponentCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InputComponentCssNamespace.IInputComponentCss;
};

export = InputComponentCssModule;
