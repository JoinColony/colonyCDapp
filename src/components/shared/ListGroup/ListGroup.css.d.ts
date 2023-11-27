declare namespace ListGroupCssNamespace {
  export interface IListGroupCss {
    gapsTrue: string;
    hoverColorDark: string;
    main: string;
  }
}

declare const ListGroupCssModule: ListGroupCssNamespace.IListGroupCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ListGroupCssNamespace.IListGroupCss;
};

export = ListGroupCssModule;
