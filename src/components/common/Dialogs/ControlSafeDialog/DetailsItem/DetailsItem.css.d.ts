declare namespace DetailsItemCssNamespace {
  export interface IDetailsItemCss {
    detailsItem: string;
    detailsItemLabel: string;
    detailsItemValue: string;
  }
}

declare const DetailsItemCssModule: DetailsItemCssNamespace.IDetailsItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DetailsItemCssNamespace.IDetailsItemCss;
};

export = DetailsItemCssModule;
