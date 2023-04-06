declare namespace MainCssNamespace {
  export interface IMainCss {
    block: string;
    blur: string;
    border: string;
    container: string;
    contents: string;
    filter: string;
    fixed: string;
    grid: string;
    grow: string;
    hidden: string;
    inline: string;
    invert: string;
    lowercase: string;
    mappings: string;
    names: string;
    ordinal: string;
    query700: string;
    relative: string;
    shadow: string;
    shrink: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    static: string;
    table: string;
    transform: string;
    truncate: string;
    uppercase: string;
    version: string;
    visible: string;
  }
}

declare const MainCssModule: MainCssNamespace.IMainCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MainCssNamespace.IMainCss;
};

export = MainCssModule;
