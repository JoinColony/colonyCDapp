declare namespace InputCssNamespace {
  export interface IInputCss {
    container: string;
    containerHorizontal: string;
    extension: string;
    extensionContainer: string;
  }
}

declare const InputCssModule: InputCssNamespace.IInputCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: InputCssNamespace.IInputCss;
};

export = InputCssModule;
