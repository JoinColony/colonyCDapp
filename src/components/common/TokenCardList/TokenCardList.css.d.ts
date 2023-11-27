declare namespace TokenCardListCssNamespace {
  export interface ITokenCardListCss {
    mappings: string;
    names: string;
    query700: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    tokenCardContainer: string;
    version: string;
  }
}

declare const TokenCardListCssModule: TokenCardListCssNamespace.ITokenCardListCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TokenCardListCssNamespace.ITokenCardListCss;
};

export = TokenCardListCssModule;
