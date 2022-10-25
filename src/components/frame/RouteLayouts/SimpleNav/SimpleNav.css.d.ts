declare namespace SimpleNavCssNamespace {
  export interface ISimpleNavCss {
    nav: string;
    wrapper: string;
  }
}

declare const SimpleNavCssModule: SimpleNavCssNamespace.ISimpleNavCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SimpleNavCssNamespace.ISimpleNavCss;
};

export = SimpleNavCssModule;
