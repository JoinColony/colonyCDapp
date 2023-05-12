declare namespace SimpleNavCssNamespace {
  export interface ISimpleNavCss {
    mappings: string;
    names: string;
    nav: string;
    query850: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
    wrapper: string;
  }
}

declare const SimpleNavCssModule: SimpleNavCssNamespace.ISimpleNavCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SimpleNavCssNamespace.ISimpleNavCss;
};

export = SimpleNavCssModule;
