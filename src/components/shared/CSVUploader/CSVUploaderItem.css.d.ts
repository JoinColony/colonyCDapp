declare namespace CsvUploaderItemCssNamespace {
  export interface ICsvUploaderItemCss {
    fileName: string;
    loadingSpinnerContainer: string;
    main: string;
  }
}

declare const CsvUploaderItemCssModule: CsvUploaderItemCssNamespace.ICsvUploaderItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CsvUploaderItemCssNamespace.ICsvUploaderItemCss;
};

export = CsvUploaderItemCssModule;
