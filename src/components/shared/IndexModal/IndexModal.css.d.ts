declare namespace IndexModalCssNamespace {
  export interface IIndexModalCss {
    backButton: string;
    content: string;
    header: string;
    primaryPadding: string;
    secondaryPadding: string;
  }
}

declare const IndexModalCssModule: IndexModalCssNamespace.IIndexModalCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexModalCssNamespace.IIndexModalCss;
};

export = IndexModalCssModule;
