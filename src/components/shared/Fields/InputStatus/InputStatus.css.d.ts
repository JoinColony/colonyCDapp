declare namespace InputStatusCssNamespace {
  export interface IInputStatusCss {
    directionHorizontal: string;
    main: string;
    mappings: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    stateError: string;
    stateHidden: string;
    statusSchemaInfo: string;
    textSpaceWrap: string;
    themeFat: string;
    themeMinimal: string;
    themeUnderlined: string;
    version: string;
  }
}

declare const InputStatusCssModule: InputStatusCssNamespace.IInputStatusCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InputStatusCssNamespace.IInputStatusCss;
};

export = InputStatusCssModule;
