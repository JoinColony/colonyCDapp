declare namespace ConfirmTransactionsCssNamespace {
  export interface IConfirmTransactionsCss {
    container: string;
    mappings: string;
    names: string;
    query428: string;
    sourceRoot: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const ConfirmTransactionsCssModule: ConfirmTransactionsCssNamespace.IConfirmTransactionsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ConfirmTransactionsCssNamespace.IConfirmTransactionsCss;
};

export = ConfirmTransactionsCssModule;
