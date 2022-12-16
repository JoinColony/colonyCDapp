declare namespace SharedCssNamespace {
  export interface ISharedCss {
    mappings: string;
    names: string;
    paragraph: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    submitButton: string;
    truncated: string;
    version: string;
  }
}

declare const SharedCssModule: SharedCssNamespace.ISharedCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SharedCssNamespace.ISharedCss;
};

export = SharedCssModule;
