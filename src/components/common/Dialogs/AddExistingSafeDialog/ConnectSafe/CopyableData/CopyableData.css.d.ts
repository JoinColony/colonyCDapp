declare namespace CopyableDataCssNamespace {
  export interface ICopyableDataCss {
    copyable: string;
    copyableContainer: string;
    fat: string;
    subtitle: string;
  }
}

declare const CopyableDataCssModule: CopyableDataCssNamespace.ICopyableDataCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CopyableDataCssNamespace.ICopyableDataCss;
};

export = CopyableDataCssModule;
