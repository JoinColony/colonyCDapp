declare namespace InputStatusCssNamespace {
  export interface IInputStatusCss {
    directionHorizontal: string;
    main: string;
    stateError: string;
    stateHidden: string;
    statusSchemaInfo: string;
    textSpaceWrap: string;
    themeFat: string;
    themeMinimal: string;
    themeUnderlined: string;
  }
}

declare const InputStatusCssModule: InputStatusCssNamespace.IInputStatusCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InputStatusCssNamespace.IInputStatusCss;
};

export = InputStatusCssModule;
