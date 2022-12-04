declare namespace ListGroupItemCssNamespace {
  export interface IListGroupItemCss {
    paddingMedium: string;
    paddingNone: string;
  }
}

declare const ListGroupItemCssModule: ListGroupItemCssNamespace.IListGroupItemCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ListGroupItemCssNamespace.IListGroupItemCss;
};

export = ListGroupItemCssModule;
