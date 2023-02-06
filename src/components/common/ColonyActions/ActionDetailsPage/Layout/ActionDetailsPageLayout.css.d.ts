declare namespace ActionDetailsPageLayoutCssNamespace {
  export interface IActionDetailsPageLayoutCss {
    center: string;
    centered: string;
    layout: string;
    main: string;
    mappings: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const ActionDetailsPageLayoutCssModule: ActionDetailsPageLayoutCssNamespace.IActionDetailsPageLayoutCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ActionDetailsPageLayoutCssNamespace.IActionDetailsPageLayoutCss;
};

export = ActionDetailsPageLayoutCssModule;
