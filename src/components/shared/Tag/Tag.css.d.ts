declare namespace TagCssNamespace {
  export interface ITagCss {
    baseStyles: string;
    colorSchemaInverted: string;
    colorSchemaPlain: string;
    fontSizeSmall: string;
    fontSizeTiny: string;
    icon: string;
    main: string;
    marginNone: string;
    themeBanned: string;
    themeBlue: string;
    themeDanger: string;
    themeDangerGhost: string;
    themeGolden: string;
    themeLight: string;
    themePink: string;
    themePrimary: string;
  }
}

declare const TagCssModule: TagCssNamespace.ITagCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TagCssNamespace.ITagCss;
};

export = TagCssModule;
