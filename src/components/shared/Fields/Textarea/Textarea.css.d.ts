declare namespace TextareaCssNamespace {
  export interface ITextareaCss {
    alignRight: string;
    colorSchemaDark: string;
    colorSchemaGrey: string;
    colorSchemaTransparent: string;
    container: string;
    containerHorizontal: string;
    count: string;
    error: string;
    layoutInline: string;
    limit: string;
    main: string;
    resizableBoth: string;
    resizableHorizontal: string;
    resizableVertical: string;
    textareaAutoresizeWrapper: string;
    textareaWrapper: string;
    themeFat: string;
  }
}

declare const TextareaCssModule: TextareaCssNamespace.ITextareaCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TextareaCssNamespace.ITextareaCss;
};

export = TextareaCssModule;
