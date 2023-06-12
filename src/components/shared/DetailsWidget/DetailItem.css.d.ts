declare namespace DetailItemCssNamespace {
  export interface IDetailItemCss {
    item: string;
    label: string;
    tooltip: string;
    value: string;
  }
}

declare const DetailItemCssModule: DetailItemCssNamespace.IDetailItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DetailItemCssNamespace.IDetailItemCss;
};

export = DetailItemCssModule;
