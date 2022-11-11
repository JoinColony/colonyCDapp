declare namespace ClickableHeadingCssNamespace {
  export interface IClickableHeadingCss {
    contents: string;
    heading: string;
    icon: string;
  }
}

declare const ClickableHeadingCssModule: ClickableHeadingCssNamespace.IClickableHeadingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ClickableHeadingCssNamespace.IClickableHeadingCss;
};

export = ClickableHeadingCssModule;
