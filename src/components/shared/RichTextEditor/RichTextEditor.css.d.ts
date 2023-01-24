declare namespace RichTextEditorCssNamespace {
  export interface IRichTextEditorCss {
    characterCount: string;
    disabled: string;
    editorContainer: string;
    error: string;
    main: string;
  }
}

declare const RichTextEditorCssModule: RichTextEditorCssNamespace.IRichTextEditorCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: RichTextEditorCssNamespace.IRichTextEditorCss;
};

export = RichTextEditorCssModule;
