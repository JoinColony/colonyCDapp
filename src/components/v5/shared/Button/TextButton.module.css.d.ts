declare namespace TextButtonModuleCssNamespace {
  export interface ITextButtonModuleCss {
    textButton: string;
    underlined: string;
  }
}

declare const TextButtonModuleCssModule: TextButtonModuleCssNamespace.ITextButtonModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TextButtonModuleCssNamespace.ITextButtonModuleCss;
};

export = TextButtonModuleCssModule;
