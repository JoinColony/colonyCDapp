declare namespace HelperSectionCssNamespace {
  export interface IHelperSectionCss {
    externalLink: string;
    mappings: string;
    names: string;
    queries: string;
    query428: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const HelperSectionCssModule: HelperSectionCssNamespace.IHelperSectionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: HelperSectionCssNamespace.IHelperSectionCss;
};

export = HelperSectionCssModule;
