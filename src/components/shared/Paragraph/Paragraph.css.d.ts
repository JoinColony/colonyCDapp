declare namespace ParagraphCssNamespace {
  export interface IParagraphCss {
    main: string;
  }
}

declare const ParagraphCssModule: ParagraphCssNamespace.IParagraphCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ParagraphCssNamespace.IParagraphCss;
};

export = ParagraphCssModule;
