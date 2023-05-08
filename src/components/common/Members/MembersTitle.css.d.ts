declare namespace MembersTitleCssNamespace {
  export interface IMembersTitleCss {
    clearButton: string;
    icon: string;
    input: string;
    mappings: string;
    names: string;
    query428: string;
    searchContainer: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    titleContainer: string;
    titleLeft: string;
    version: string;
  }
}

declare const MembersTitleCssModule: MembersTitleCssNamespace.IMembersTitleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MembersTitleCssNamespace.IMembersTitleCss;
};

export = MembersTitleCssModule;
