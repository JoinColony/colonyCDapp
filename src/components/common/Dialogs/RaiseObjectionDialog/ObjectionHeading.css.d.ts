declare namespace ObjectionHeadingCssNamespace {
  export interface IObjectionHeadingCss {
    descriptionText: string;
    title: string;
  }
}

declare const ObjectionHeadingCssModule: ObjectionHeadingCssNamespace.IObjectionHeadingCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ObjectionHeadingCssNamespace.IObjectionHeadingCss;
};

export = ObjectionHeadingCssModule;
