declare namespace SelectedTokenCssNamespace {
  export interface ISelectedTokenCss {
    mappings: string;
    names: string;
    query850: string;
    selectedToken: string;
    selectedTokenAmount: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    tokenDisplayFontWeight: string;
    tokenDisplaySymbolFontSize: string;
    version: string;
  }
}

declare const SelectedTokenCssModule: SelectedTokenCssNamespace.ISelectedTokenCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SelectedTokenCssNamespace.ISelectedTokenCss;
};

export = SelectedTokenCssModule;
