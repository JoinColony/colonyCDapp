declare namespace VerticalTabListCssNamespace {
  export interface IVerticalTabListCss {
    main: string;
  }
}

declare const VerticalTabListCssModule: VerticalTabListCssNamespace.IVerticalTabListCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VerticalTabListCssNamespace.IVerticalTabListCss;
};

export = VerticalTabListCssModule;
