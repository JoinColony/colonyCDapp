declare namespace InputLabelCssNamespace {
  export interface IInputLabelCss {
    colorSchemaDark: string;
    colorSchemaGrey: string;
    directionHorizontal: string;
    error: string;
    extra: string;
    help: string;
    helpAlignRight: string;
    labelText: string;
    main: string;
    sizeMedium: string;
    stateScreenReaderOnly: string;
    themeFat: string;
    themeMinimal: string;
    themeUnderlined: string;
  }
}

declare const InputLabelCssModule: InputLabelCssNamespace.IInputLabelCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InputLabelCssNamespace.IInputLabelCss;
};

export = InputLabelCssModule;
